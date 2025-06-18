<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class InventoryController extends Controller
{
    public function getInventoryStats()
    {
        $stats = [
            'total_products' => Product::count(),
            'low_stock_items' => Product::whereRaw('quantity <= alert_quantity')->count(),
            'out_of_stock' => Product::where('quantity', 0)->count(),
            'total_value' => Product::sum(DB::raw('price * quantity')),
        ];

        return response()->json($stats);
    }

    public function adjustStock(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:add,remove',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($id);
            $adjustment = $request->type === 'add' ? $request->quantity : -$request->quantity;

            // Check if we have enough stock for removal
            if ($request->type === 'remove' && $product->quantity < $request->quantity) {
                return response()->json([
                    'error' => 'Insufficient stock for removal'
                ], 422);
            }

            // Update product quantity
            $product->quantity += $adjustment;
            $product->save();

            // Record the transaction
            InventoryTransaction::create([
                'product_id' => $id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'reason' => $request->reason,
                'previous_quantity' => $product->quantity - $adjustment,
                'new_quantity' => $product->quantity,
                'user_id' => auth()->id(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Stock adjusted successfully',
                'new_quantity' => $product->quantity
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to adjust stock'], 500);
        }
    }

    public function getTransactions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'nullable|exists:products,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'type' => 'nullable|in:add,remove',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = InventoryTransaction::with(['product', 'user'])
            ->when($request->product_id, function ($q) use ($request) {
                return $q->where('product_id', $request->product_id);
            })
            ->when($request->start_date, function ($q) use ($request) {
                return $q->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($q) use ($request) {
                return $q->whereDate('created_at', '<=', $request->end_date);
            })
            ->when($request->type, function ($q) use ($request) {
                return $q->where('type', $request->type);
            })
            ->latest();

        $transactions = $query->paginate(15);

        return response()->json($transactions);
    }

    public function exportInventory()
    {
        $products = Product::select([
            'id', 'name', 'sku', 'barcode', 'quantity',
            'alert_quantity', 'price', 'category_id',
            'created_at', 'updated_at'
        ])->with('category:id,name')->get();

        $filename = 'inventory_export_' . Carbon::now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, [
            'ID', 'Name', 'SKU', 'Barcode', 'Category',
            'Quantity', 'Alert Quantity', 'Price', 'Created At', 'Updated At'
        ]);

        foreach ($products as $product) {
            fputcsv($handle, [
                $product->id,
                $product->name,
                $product->sku,
                $product->barcode,
                $product->category ? $product->category->name : 'Uncategorized',
                $product->quantity,
                $product->alert_quantity,
                $product->price,
                $product->created_at,
                $product->updated_at,
            ]);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content, 200, $headers);
    }

    public function importInventory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('file');
            $handle = fopen($file->getPathname(), 'r');

            // Skip header row
            fgetcsv($handle);

            DB::beginTransaction();

            while (($data = fgetcsv($handle)) !== false) {
                $sku = $data[2]; // SKU is in the third column

                $product = Product::where('sku', $sku)->first();
                if ($product) {
                    // Update existing product
                    $product->update([
                        'quantity' => $data[5], // Quantity column
                        'alert_quantity' => $data[6], // Alert Quantity column
                        'price' => $data[7], // Price column
                    ]);
                }
            }

            fclose($handle);
            DB::commit();

            return response()->json([
                'message' => 'Inventory imported successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to import inventory data'
            ], 500);
        }
    }
}
