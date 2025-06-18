<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'credit_limit',
        'balance',
        'is_active'
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function getTotalSpentAttribute()
    {
        return $this->sales()->sum('total');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function hasAvailableCredit()
    {
        return $this->balance < $this->credit_limit;
    }
}
