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
            'name' => 'Mobile',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('categories')->insert([
            'id' => 2,
            'name' => 'Tablet',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('categories')->insert([
            'id' => 3,
            'name' => 'Wireless Buds',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
