<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesAnalytics extends Model
{
    protected $fillable = [
        'date',
        'total_sales',
        'total_orders',
        'average_order_value',
        'total_discounts'
    ];

    protected $casts = [
        'date' => 'date',
        'total_sales' => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'total_discounts' => 'decimal:2'
    ];
}
