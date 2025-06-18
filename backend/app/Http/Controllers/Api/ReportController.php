<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'sales');
        $range = $request->input('range', 'today');
        $timeRange = $request->input('timeRange', '7d');

        // Get date range
        $startDate = $this->getStartDate($range);
        $endDate = Carbon::now();

        // Get comparison date range for growth calculation
        $previousStartDate = (clone $startDate)->subDays($startDate->diffInDays($endDate));
        $previousEndDate = (clone $startDate)->subSecond();

        // Get base query for current period
        $salesQuery = Sale::whereBetween('created_at', [$startDate, $endDate]);
        $previousSalesQuery = Sale::whereBetween('created_at', [$previousStartDate, $previousEndDate]);

        // Calculate summary statistics
        $summary = [
            'totalSales' => $salesQuery->sum('total_amount'),
            'totalOrders' => $salesQuery->count(),
            'averageOrderValue' => $salesQuery->avg('total_amount') ?? 0,
            'totalCustomers' => Customer::count(),
            'totalProducts' => Product::count(),
        ];

        // Calculate previous period metrics for growth
        $previousSales = $previousSalesQuery->sum('total_amount');
        $previousOrders = $previousSalesQuery->count();
        $previousAverage = $previousSalesQuery->avg('total_amount') ?? 0;

        // Calculate growth percentages
        $salesGrowth = $previousSales > 0 ? (($summary['totalSales'] - $previousSales) / $previousSales) * 100 : 0;
        $ordersGrowth = $previousOrders > 0 ? (($summary['totalOrders'] - $previousOrders) / $previousOrders) * 100 : 0;
        $averageGrowth = $previousAverage > 0 ? (($summary['averageOrderValue'] - $previousAverage) / $previousAverage) * 100 : 0;

        // Get top performing products
        $topProducts = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(sale_items.quantity) as quantity'),
                DB::raw('SUM(sale_items.quantity * sale_items.unit_price) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                // Calculate product growth
                $growth = rand(3, 15); // Mock growth for demo
                return [
                    'name' => $product->name,
                    'quantity' => $product->quantity,
                    'revenue' => $product->revenue,
                    'growth' => '+' . $growth . '%'
                ];
            });

        // Get low stock items
        $lowStockItems = Product::select('name', 'quantity', 'alert_quantity')
            ->whereColumn('quantity', '<=', 'alert_quantity')
            ->orderBy('quantity')
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'totalSales' => round($summary['totalSales'], 2),
                'totalOrders' => $summary['totalOrders'],
                'averageOrderValue' => round($summary['averageOrderValue'], 2),
                'totalCustomers' => $summary['totalCustomers'],
                'totalProducts' => $summary['totalProducts'],
                'salesGrowth' => round($salesGrowth, 1),
                'ordersGrowth' => round($ordersGrowth, 1),
                'averageGrowth' => round($averageGrowth, 1),
            ],
            'topProducts' => $topProducts,
            'lowStockItems' => $lowStockItems,
        ]);
    }

    public function download(Request $request)
    {
        // TODO: Implement report download
        return response()->json(['message' => 'Report download not implemented yet'], 501);
    }

    private function getStartDate($range)
    {
        $now = Carbon::now();

        switch ($range) {
            case 'today':
                return $now->startOfDay();
            case 'week':
                return $now->startOfWeek();
            case 'month':
                return $now->startOfMonth();
            case 'year':
                return $now->startOfYear();
            default:
                return $now->startOfDay();
        }
    }
}
