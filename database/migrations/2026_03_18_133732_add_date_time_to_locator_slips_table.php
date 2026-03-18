<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('locator_slips', function (Blueprint $table) {
            $table->dateTime('date_time')->nullable()->after('destination');
        });
    }

    public function down(): void
    {
        Schema::table('locator_slips', function (Blueprint $table) {
            $table->dropColumn('date_time');
        });
    }
};
