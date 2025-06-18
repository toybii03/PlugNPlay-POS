<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Config;

class VerifyFeedbackToken
{
    public function handle(Request $request, Closure $next)
    {
        $orderId = $request->route('order_id');
        $token = $request->route('token');

        $order = Order::findOrFail($orderId);

        $expectedToken = hash_hmac('sha256', $order->id . $order->created_at, Config::get('app.key'));

        if (!hash_equals($expectedToken, $token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid feedback token'
            ], 403);
        }

        return $next($request);
    }
}
