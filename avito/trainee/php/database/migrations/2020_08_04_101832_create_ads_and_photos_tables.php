<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdsAndPhotosTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('description', 3000);
            $table->decimal('price');
            $table->date('created_at')->useCurrent();
        });

        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('url', 512);
            $table->boolean('first')->default(false);
            $table->foreignId('ad_id')
                ->constrained('ads')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('photos');
        Schema::dropIfExists('ads');
    }
}
