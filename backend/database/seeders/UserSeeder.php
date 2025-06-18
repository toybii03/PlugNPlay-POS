<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '1234567890',
            'address' => '123 Admin St',
            'is_active' => true,
        ]);

        // Create manager user
        User::create([
            'name' => 'Manager User',
            'username' => 'manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'phone' => '2468910',
            'address' => '789 Manager St',
            'is_active' => true,
        ]);

        // Create cashier user
        User::create([
            'name' => 'Cashier User',
            'username' => 'cashier',
            'email' => 'cashier@example.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'phone' => '0987654321',
            'address' => '456 Cashier St',
            'is_active' => true,
        ]);
    }
}
