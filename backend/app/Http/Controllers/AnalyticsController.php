<?php

namespace App\Http\Controllers;

use App\Models\SalesAnalytics;
use App\Models\InventoryAnalytics;
use App\Models\CustomerAnalytics;
use App\Models\CustomerFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function getSalesAnalytics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = SalesAnalytics::query();

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        $salesData = $query->get();

        return response()->json([
            'success' => true,
            'data' => $salesData
        ]);
    }

    public function getInventoryAnalytics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $productId = $request->input('product_id');

        $query = InventoryAnalytics::with('product');

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        if ($productId) {
            $query->where('product_id', $productId);
        }

        $inventoryData = $query->get();

        return response()->json([
            'success' => true,
            'data' => $inventoryData
        ]);
    }

    public function getCustomerAnalytics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $customerId = $request->input('customer_id');

        $query = CustomerAnalytics::with('customer');

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        if ($customerId) {
            $query->where('customer_id', $customerId);
        }

        $customerData = $query->get();

        return response()->json([
            'success' => true,
            'data' => $customerData
        ]);
    }

    public function getFeedbackAnalytics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = CustomerFeedback::with(['customer', 'order']);

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $feedbackData = $query->get();

        // Calculate average rating
        $averageRating = $feedbackData->avg('rating');

        // Calculate rating distribution
        $ratingDistribution = $feedbackData->groupBy('rating')
            ->map(function ($group) {
                return $group->count();
            });

        return response()->json([
            'success' => true,
            'data' => [
                'feedback' => $feedbackData,
                'average_rating' => $averageRating,
                'rating_distribution' => $ratingDistribution
            ]
        ]);
    }

    public function getDashboardStats()
    {
        // Get today's date
        $today = now()->format('Y-m-d');

        // Get sales stats
        $salesStats = SalesAnalytics::where('date', $today)->first();

        // Get low stock products
        $lowStockProducts = DB::table('products')
            ->where('quantity', '<=', DB::raw('alert_quantity'))
            ->select('id', 'name', 'quantity', 'alert_quantity')
            ->get();

        // Get total transactions count
        $totalTransactions = DB::table('sales')->count();

        // Get total products count
        $totalProducts = DB::table('products')->count();

        // Get total customers count
        $totalCustomers = DB::table('customers')->count();

        // Get sum of today's sales amount
        $todaysSalesAmount = DB::table('sales')
            ->whereDate('created_at', $today)
            ->sum('total');

        // Removed recent feedback as per user request
        $recentFeedback = [];

        return response()->json([
            'success' => true,
            'data' => [
                'sales_stats' => $salesStats,
                'low_stock_products' => $lowStockProducts,
                'total_transactions' => $totalTransactions,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'todays_sales_amount' => $todaysSalesAmount,
                'recent_feedback' => $recentFeedback
            ]
        ]);
    }
}
