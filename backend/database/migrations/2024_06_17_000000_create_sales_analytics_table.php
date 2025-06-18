<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesAnalyticsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales_analytics', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->decimal('total_sales', 15, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->integer('total_products_sold')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_analytics');
    }
}
