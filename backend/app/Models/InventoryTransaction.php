<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'reason',
        'previous_quantity',
        'new_quantity',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'previous_quantity' => 'integer',
        'new_quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
