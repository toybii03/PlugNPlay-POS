<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Sale;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        // Validate payment data
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'due_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Generate invoice number
        $data['invoice_number'] = 'INV-' . strtoupper(Str::random(8));
        // Set user_id from authenticated user, default to 1 if not authenticated
        $data['user_id'] = Auth::id() ?? 1;

        // Create and save the sale record
        $sale = Sale::create($data);

        // Process sale items and decrement product quantities
        foreach ($data['items'] as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            if ($product) {
                $product->quantity -= $item['quantity'];
                if ($product->quantity < 0) {
                    $product->quantity = 0; // Prevent negative quantity
                }
                $product->save();
            }
            // Optionally, create SaleItem records here if model exists
        }

        return response()->json([
            'message' => 'Sale recorded successfully',
            'data' => $sale
        ], 201);
    }

    public function index(Request $request)
    {
        $sales = Sale::with('customer')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $data = $sales->map(function ($sale) {
            return [
                'id' => $sale->id,
                'date' => $sale->created_at->format('Y-m-d H:i:s'),
                'customer' => $sale->customer ? $sale->customer->name : 'N/A',
                'amount' => $sale->total,
                'method' => $sale->payment_method,
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'total' => $sales->total(),
                'per_page' => $sales->perPage(),
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'from' => $sales->firstItem(),
                'to' => $sales->lastItem(),
            ],
        ]);
    }
}
