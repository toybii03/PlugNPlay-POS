<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerAnalytics extends Model
{
    protected $fillable = [
        'customer_id',
        'date',
        'total_spent',
        'order_count',
        'average_rating'
    ];

    protected $casts = [
        'date' => 'date',
        'total_spent' => 'decimal:2',
        'average_rating' => 'decimal:2'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
