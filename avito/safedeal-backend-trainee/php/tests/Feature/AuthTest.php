<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use RoleSeeder;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;
use UserSeeder;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login procedure for seller.
     *
     * @return void
     */
    public function testLoginSeller()
    {
        $this->seed(RoleSeeder::class);
        $this->seed(UserSeeder::class);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'seller@localhost',
            'password' => 'seller'
        ]);

        $response->assertStatus(Response::HTTP_OK);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    /**
     * Test login procedure for courier.
     *
     * @return void
     */
    public function testLoginCourier()
    {
        $this->seed(RoleSeeder::class);
        $this->seed(UserSeeder::class);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'courier@localhost',
            'password' => 'courier'
        ]);

        $response->assertStatus(Response::HTTP_OK);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    /**
     * Test login procedure for customer.
     *
     * @return void
     */
    public function testLoginCustomer()
    {
        $this->seed(RoleSeeder::class);
        $this->seed(UserSeeder::class);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'customer@localhost',
            'password' => 'customer'
        ]);

        $response->assertStatus(Response::HTTP_OK);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    /**
     * Test token refreshing.
     *
     * @return void
     */
    public function testRefreshToken()
    {
        $this->seed(RoleSeeder::class);
        $this->seed(UserSeeder::class);

        $user = User::where('name', 'seller')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/refresh');

        $response->assertStatus(Response::HTTP_OK);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    /**
     * Test logout procedure.
     *
     * @return void
     */
    public function testLogout()
    {
        $this->seed(RoleSeeder::class);
        $this->seed(UserSeeder::class);

        $user = User::where('name', 'seller')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJson(['message' => 'User successfully signed out']);
    }
}
