<?php

namespace Tests\Feature;

use App\Deal;
use App\Role;
use App\User;
use DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class DealTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test to fetch all deals as seller.
     *
     * @return void
     */
    public function testFetchAllDealsAsSeller()
    {
        $this->seed(DatabaseSeeder::class);
        $deals = Deal::all();

        $role = Role::where('name', Role::SELLER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/');

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'address',
                    'delivery_date'
                ]
            ]);
        $this->assertSameSize($deals, $response->json());
    }

    /**
     * Test to fetch all deals as courier.
     *
     * @return void
     */
    public function testFetchAllDealsAsCourier()
    {
        $this->seed(DatabaseSeeder::class);
        $deals = Deal::all();

        $role = Role::where('name', Role::COURIER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/');

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'address',
                    'delivery_date'
                ]
            ]);
        $this->assertSameSize($deals, $response->json());
    }

    /**
     * Test that customer cannot fetch all deals.
     *
     * @return void
     */
    public function testFetchAllDealsAsCustomer()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that seller can fetch deal by id.
     *
     * @return void
     */
    public function testFetchDeliveryByIdAsSeller()
    {
        $this->seed(DatabaseSeeder::class);

        $dealId = Deal::first()->id;

        $role = Role::where('name', Role::SELLER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/' . $dealId);

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'id',
                'product_id',
                'cost',
                'address',
                'delivery_date',
                'user_id',
                'created_at',
                'updated_at',
            ])
            ->assertJsonPath('id', $dealId);
    }

    /**
     * Test that courier can fetch deal by id.
     *
     * @return void
     */
    public function testFetchDeliveryByIdAsCourier()
    {
        $this->seed(DatabaseSeeder::class);

        $dealId = Deal::first()->id;

        $role = Role::where('name', Role::COURIER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/' . $dealId);

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'id',
                'product_id',
                'cost',
                'address',
                'delivery_date',
                'user_id',
                'created_at',
                'updated_at',
            ])
            ->assertJsonPath('id', $dealId);
    }

    /**
     * Test that customer can fetch own deal by id.
     *
     * @return void
     */
    public function testFetchDeliveryByIdAsCustomer()
    {
        $this->seed(DatabaseSeeder::class);

        $deal = Deal::first();
        $dealId = $deal->id;

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);

        $deal->user_id = $user->id;
        $deal->save();
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/' . $dealId);

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'id',
                'product_id',
                'cost',
                'address',
                'delivery_date',
                'user_id',
                'created_at',
                'updated_at',
            ])
            ->assertJsonPath('id', $dealId)
            ->assertJsonPath('user_id', $user->id);
    }

    /**
     * Test that only customer that ordered deal can fetch one by id.
     *
     * @return void
     */
    public function testFetchDeliveryByIdAsAnotherCustomer()
    {
        $this->seed(DatabaseSeeder::class);

        $deal = Deal::first();
        $dealId = $deal->id;

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();

        $another = new User();
        $another->email = 'another@localhost';
        $another->name = 'another';
        $another->password = Hash::make('another');
        $another->save();
        $another->roles()->attach($role);
        $token = JWTAuth::fromUser($another);

        $deal->user_id = $user->id;
        $deal->save();
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/' . $dealId);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that customer can get delivery cost.
     *
     * @return void
     */
    public function testDeliveryCostAsCustomer()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/deliveryCost?address=SomeAddress');

        $response
            ->assertStatus(Response::HTTP_OK)
            ->assertJson(['cost' => 100]);
    }

    /**
     * Test that seller can get delivery cost.
     *
     * @return void
     */
    public function testDeliveryCostAsSeller()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::SELLER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/deliveryCost?address=SomeAddress');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that courier can get delivery cost.
     *
     * @return void
     */
    public function testDeliveryCostAsCourier()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::COURIER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/deliveryCost?address=SomeAddress');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that request fails if address is not specified.
     *
     * @return void
     */
    public function testDeliveryCostWithoutAddress()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/deal/deliveryCost');

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Test that customer can create deal.
     *
     * @return void
     */
    public function testCreateDealAsCustomer()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 1,
                'address' => '82126 Vandervort Park Suite 273 Marjorymouth, AR 06299',
                'delivery_date' => '2020-08-25 10:20:44'
            ]);

        $response
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJsonStructure([
                'id'
            ]);
    }

    /**
     * Test that seller cannot create deal.
     *
     * @return void
     */
    public function testCreateDealAsSeller()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::SELLER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 1,
                'address' => '82126 Vandervort Park Suite 273 Marjorymouth, AR 06299',
                'delivery_date' => '2020-08-25 10:20:44'
            ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that courier cannot create deal.
     *
     * @return void
     */
    public function testCreateDealAsCourier()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::COURIER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 1,
                'address' => '82126 Vandervort Park Suite 273 Marjorymouth, AR 06299',
                'delivery_date' => '2020-08-25 10:20:44'
            ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that request fails with invalid product id.
     *
     * @return void
     */
    public function testCreateDealInvalidProductId()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 0,
                'address' => '82126 Vandervort Park Suite 273 Marjorymouth, AR 06299',
                'delivery_date' => '2020-08-25 10:20:44'
            ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Test that request fails with invalid address.
     *
     * @return void
     */
    public function testCreateDealInvalidAddress()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 1,
                'address' => str_repeat(' ', 513),
                'delivery_date' => '2020-08-25 10:20:44'
            ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Test that request fails with invalid delivery date.
     *
     * @return void
     */
    public function testCreateDealInvalidDeliveryDate()
    {
        $this->seed(DatabaseSeeder::class);

        $role = Role::where('name', Role::CUSTOMER_ROLE)->first();
        $user = $role->users->first();
        $token = JWTAuth::fromUser($user);
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/deal/', [
                'product_id' => 1,
                'address' => '82126 Vandervort Park Suite 273 Marjorymouth, AR 06299',
                'delivery_date' => '2020-13-25 10:20:44'
            ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
