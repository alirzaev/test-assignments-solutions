<?php

use App\Role;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            $sellerRole = Role::where('name', Role::SELLER_ROLE)->first();
            $customerRole = Role::where('name', Role::CUSTOMER_ROLE)->first();
            $courierRole = Role::where('name', Role::COURIER_ROLE)->first();

            $admin = new User();
            $admin->name = 'seller';
            $admin->email = 'seller@localhost';
            $admin->email_verified_at = now();
            $admin->password = Hash::make('seller');
            $admin->remember_token = Str::random(10);
            $admin->save();
            $admin->roles()->attach($sellerRole);

            $courier = new User();
            $courier->name = 'courier';
            $courier->email = 'courier@localhost';
            $courier->email_verified_at = now();
            $courier->password = Hash::make('courier');
            $courier->remember_token = Str::random(10);
            $courier->save();
            $courier->roles()->attach($courierRole);

            $customer = new User();
            $customer->name = 'customer';
            $customer->email = 'customer@localhost';
            $customer->email_verified_at = now();
            $customer->password = Hash::make('customer');
            $customer->remember_token = Str::random(10);
            $customer->save();
            $customer->roles()->attach($customerRole);
        });
    }
}
