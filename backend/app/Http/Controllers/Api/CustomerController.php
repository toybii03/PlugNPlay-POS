<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric',
            'balance' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    public function index(Request $request)
    {
        $customers = Customer::orderBy('created_at', 'desc')->paginate(20);

        $data = $customers->map(function ($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'tier' => $customer->tier ?? 'Bronze',
                'totalSpent' => $customer->total_spent ?? 0,
                'totalOrders' => $customer->total_orders ?? 0,
                'loyaltyPoints' => $customer->loyalty_points ?? 0,
                'lastVisit' => $customer->last_visit ?? $customer->created_at,
                'joinDate' => $customer->created_at,
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'from' => $customers->firstItem(),
                'to' => $customers->lastItem(),
            ],
        ]);
    }
}
