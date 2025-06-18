<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category');

        if ($request->has('search')) {
            $products->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->boolean('low_stock')) {
            $products->whereColumn('quantity', '<=', 'alert_quantity');
        }

        return response()->json([
            'data' => $products->get()
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'sku' => 'required|string|unique:products',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'cost_price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0',
                'alert_quantity' => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,id',
                // Removed barcode validation as per user request
                //'barcode' => 'nullable|string|unique:products',
                'image' => 'nullable|image|max:2048',
                'is_active' => 'boolean'
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $validated['image'] = $path;
            }

            $product = Product::create($validated);

            return response()->json($product, 201);
        } catch (\Exception $e) {
            \Log::error('Product creation error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['error' => 'Product creation failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'alert_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
