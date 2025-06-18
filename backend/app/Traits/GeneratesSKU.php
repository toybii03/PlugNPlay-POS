<?php

namespace App\Traits;

trait GeneratesSKU
{
    protected function generateSKU(): string
    {
        $prefix = 'SKU';
        $timestamp = now()->format('ymdHi');
        $random = strtoupper(substr(uniqid(), -3));

        return $prefix . $timestamp . $random;
    }
}
