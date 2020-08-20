<?php

/** @var Factory $factory */

use App\Deal;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Deal::class, function (Faker $faker) {
    return [
        'product_id' => $faker->numberBetween(1, 1024),
        'cost' => $faker->randomFloat(6, 0.01, 1000),
        'address' => $faker->address,
        'delivery_date' => $faker->dateTimeThisMonth
    ];
});
