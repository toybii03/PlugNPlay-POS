<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['add', 'remove']);
            $table->integer('quantity');
            $table->string('reason');
            $table->integer('previous_quantity');
            $table->integer('new_quantity');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
