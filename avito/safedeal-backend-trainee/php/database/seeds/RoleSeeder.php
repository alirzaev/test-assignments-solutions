<?php

use App\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            DB::table('roles')->insert([
                'name' => Role::CUSTOMER_ROLE,
                'description' => 'A Customer User'
            ]);

            DB::table('roles')->insert([
                'name' => Role::SELLER_ROLE,
                'description' => 'A Seller User'
            ]);

            DB::table('roles')->insert([
                'name' => Role::COURIER_ROLE,
                'description' => 'A Courier User'
            ]);
        });
    }
}
