<?php

namespace App\Http\Controllers;

use App\Models\CustomerFeedback;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    public function submitFeedback(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'customer_id' => 'required|exists:customers,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback = CustomerFeedback::create($request->all());

        // Update customer analytics
        $this->updateCustomerAnalytics($request->customer_id);

        return response()->json([
            'success' => true,
            'data' => $feedback
        ]);
    }

    public function getFeedback(Request $request)
    {
        $query = CustomerFeedback::with(['customer', 'order']);

        if ($request->has('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $feedback = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $feedback
        ]);
    }

    private function updateCustomerAnalytics($customerId)
    {
        $customer = Customer::find($customerId);

        if (!$customer) {
            return;
        }

        // Calculate average rating
        $averageRating = CustomerFeedback::where('customer_id', $customerId)
            ->avg('rating');

        // Update customer analytics
        $customer->update([
            'average_rating' => $averageRating
        ]);
    }
}
