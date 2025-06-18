<?php

namespace App\Traits;

trait GeneratesBarcode
{
    protected function generateSKU($prefix = 'SKU')
    {
        // Generate a unique timestamp-based identifier
        $timestamp = now()->format('ymd');
        $random = strtoupper(substr(uniqid(), -4));
        return "{$prefix}{$timestamp}{$random}";
    }

    protected function generateBarcode()
    {
        // Generate EAN-13 format barcode
        // First 12 digits (random) + 1 check digit
        $number = '';
        for ($i = 0; $i < 12; $i++) {
            $number .= mt_rand(0, 9);
        }

        // Calculate check digit
        $weightFlag = true;
        $sum = 0;

        // Weight for a digit in an odd position is 1 and weight for a digit in an even position is 3
        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $sum += (int)$number[$i] * ($weightFlag ? 3 : 1);
            $weightFlag = !$weightFlag;
        }

        $checkDigit = (10 - ($sum % 10)) % 10;

        return $number . $checkDigit;
    }
}
