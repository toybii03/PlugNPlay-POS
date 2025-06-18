<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            'id' => 1,
            'name' => 'Default Category',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
