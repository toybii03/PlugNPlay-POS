<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\ProjectManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\CustomerController;

// Authentication Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::apiResource('customers', CustomerController::class)->except(['index', 'store']);
});

// Analytics Routes
Route::middleware(['auth:sanctum', 'role:admin,manager'])->group(function () {
    Route::get('/analytics/sales', [AnalyticsController::class, 'getSalesAnalytics']);
    Route::get('/analytics/inventory', [AnalyticsController::class, 'getInventoryAnalytics']);
    Route::get('/analytics/customers', [AnalyticsController::class, 'getCustomerAnalytics']);
    Route::get('/analytics/feedback', [AnalyticsController::class, 'getFeedbackAnalytics']);
    Route::get('/analytics/dashboard', [AnalyticsController::class, 'getDashboardStats']);
});

// Feedback Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/feedback', [FeedbackController::class, 'submitFeedback']);
    Route::get('/feedback', [FeedbackController::class, 'getFeedback']);
});

// Public Feedback Route (for email links)
Route::get('/feedback/{order_id}/{token}', [FeedbackController::class, 'submitFeedback'])
    ->name('feedback')
    ->middleware('verify.feedback.token');

// Webhook Routes for Make.com Integrations
Route::prefix('webhooks')->group(function () {
    Route::post('asana', [WebhookController::class, 'handleAsanaWebhook']);
    Route::post('slack', [WebhookController::class, 'handleSlackWebhook']);
    Route::post('customer-interaction', [WebhookController::class, 'handleCustomerInteraction']);
});

Route::apiResource('products', ProductController::class);

Route::post('/payments', [PaymentController::class, 'store']);
Route::get('/payments', [PaymentController::class, 'index']);

// Project Management Routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/project/create', [ProjectManagementController::class, 'createProject']);
});

// User management routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
});
