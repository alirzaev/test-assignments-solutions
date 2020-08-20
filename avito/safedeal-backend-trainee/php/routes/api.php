<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => ['auth:api', 'throttle:10,1'],
    'prefix' => 'deal'
], function () {
    Route::get('/', 'DealController@getAll');
    Route::get('/{id}', 'DealController@get');
    Route::get('/deliveryCost', 'DealController@deliveryCost');
    Route::post('/', 'DealController@post');
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/login', 'AuthController@login');
    Route::post('/logout', 'AuthController@logout');
    Route::post('/refresh', 'AuthController@refresh');
    Route::get('/user', 'AuthController@user');
});
