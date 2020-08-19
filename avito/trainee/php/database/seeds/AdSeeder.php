<?php

use Illuminate\Database\Seeder;
use Faker\Generator as faker;
use Faker\Factory;
use Illuminate\Support\Facades\DB;

class AdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();

        foreach (range(0, 10) as $i) {
            DB::transaction(function () use ($faker) {
                $adId = DB::table('ads')->insertGetId([
                    'name' => $faker->words(2, true),
                    'description' => $faker->text(100),
                    'price' => $faker->randomFloat(8, 0.01, 1000000),
                    'created_at' => $faker->dateTimeThisMonth()
                ]);

                DB::table('photos')->insert([
                    'url' => $faker->imageUrl(),
                    'ad_id' => $adId,
                    'first' => true
                ]);

                DB::table('photos')->insert([
                    'url' => $faker->imageUrl(),
                    'ad_id' => $adId,
                    'first' => false
                ]);
            });
        }
    }
}
