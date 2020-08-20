<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DealController extends Controller
{
    /**
     * Get all deals.
     *
     * @param Request $request
     * @return mixed
     */
    public function getAll(Request $request)
    {
        $request->user()->authorizeRoles([Role::SELLER_ROLE, Role::COURIER_ROLE]);

        return Deal::select(['id', 'address', 'delivery_date'])
            ->orderBy('delivery_date')
            ->get();
    }

    /**
     * Get deal by id.
     *
     * @param Request $request
     * @param String $id
     * @return mixed
     */
    public function get(Request $request, string $id)
    {
        $user = $request->user();
        $user->authorizeRoles([Role::SELLER_ROLE, Role::COURIER_ROLE, Role::CUSTOMER_ROLE]);

        $deal = Deal::findOrFail($id);
        if ($user->hasRole(Role::CUSTOMER_ROLE)
            && !$user->hasAnyRole([Role::SELLER_ROLE, Role::COURIER_ROLE])
            && $user->id != $deal->user_id) {
            abort(Response::HTTP_UNAUTHORIZED, 'Unauthorized');
        }

        return Deal::findOrFail($id);
    }

    /**
     * Compute delivery cost.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function deliveryCost(Request $request)
    {
        $request->user()->authorizeRoles([Role::CUSTOMER_ROLE]);

        $request->validate([
            'address' => 'string|max:512|required'
        ]);

        return response()->json([
            'cost' => 100
        ]);
    }

    /**
     * Create new deal.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function post(Request $request)
    {
        $request->user()->authorizeRoles([Role::CUSTOMER_ROLE]);

        $validated = $request->validate([
            'product_id' => 'integer|min:1|required',
            'address' => 'string|max:512|required',
            'delivery_date' => 'date|required'
        ]);
        $validated['cost'] = 100;

        $id = Deal::insertGetId($validated);

        return response()->json([
            'id' => $id
        ], Response::HTTP_CREATED);
    }
}
