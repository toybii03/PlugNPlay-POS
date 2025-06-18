<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'description',
        'price',
        'cost_price',
        'quantity',
        'alert_quantity',
        'category_id',
        'barcode',
        'image',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'quantity' => 'integer',
        'alert_quantity' => 'integer',
        'is_active' => 'boolean'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->where('quantity', '<=', 'alert_quantity');
    }
}
