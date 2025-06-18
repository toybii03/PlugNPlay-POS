<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'body',
        'type'
    ];

    protected $casts = [
        'type' => 'string'
    ];

    public function getFormattedBody(array $replacements): string
    {
        $body = $this->body;
        foreach ($replacements as $key => $value) {
            $body = str_replace("{{$key}}", $value, $body);
        }
        return $body;
    }
}
