<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdsController extends Controller
{
    private $ADS_PER_PAGE = 10;

    /**
     * Get all ads with pagination
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getAll(Request $request)
    {
        $validated = $request->validate([
            'date_order' => Rule::in(['asc', 'desc']),
            'price_order' => Rule::in(['asc', 'desc'])
        ]);

        $query = DB::table('ads')
            ->select('name', 'price', 'photos.url as photo')
            ->join('photos', 'ads.id', 'photos.ad_id')
            ->where('photos.first', true);

        if (Arr::has($validated, 'date_order')) {
            $query = $query->orderBy('date', $validated['date_order']);
        }
        if (Arr::has($validated, 'price_order')) {
            $query = $query->orderBy('price', $validated['price_order']);
        }

        $ads = $query->simplePaginate($this->ADS_PER_PAGE);

        return response()->json($ads);
    }

    /**
     * Get ad by id
     *
     * @param Request $request
     * @param String $id
     * @return JsonResponse
     */
    public function get(Request $request, string $id)
    {
        $opts = Str::of($request->query('fields', ''))
            ->split('/_/');

        $ad = DB::transaction(function () use ($id, $opts) {
            $ad = DB::table('ads')
                ->select('ads.*', 'photos.url as photo')
                ->join('photos', 'ads.id', '=', 'photos.ad_id')
                ->where('ads.id', $id)
                ->where('photos.first', true)
                ->first();

            if (!$ad) {
                return null;
            }

            $output = [
                'name' => $ad->name,
                'price' => $ad->price,
                'photo' => $ad->photo
            ];

            if ($opts->contains('description')) {
                $output['description'] = $ad->description;
            }
            if ($opts->contains('photos')) {
                $photos = DB::table('photos')
                    ->select('url')
                    ->where('first', false)
                    ->where('ad_id', $id)
                    ->get()
                    ->toArray();

                $output['other_photos'] = $photos;
            }

            return $output;
        });

        if (!$ad) {
            abort(Response::HTTP_NOT_FOUND, 'Ad not found');
        }

        return response()->json($ad);
    }

    /**
     * Add new ad
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function post(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'max:1000'],
            'price' => ['required', 'numeric'],
            'photos' => ['required', 'array', 'min:1', 'max:3'],
            'photos.*' => ['url']
        ]);

        $adId = DB::transaction(function () use ($validated) {
            $columns = Arr::only($validated, [
                'name', 'description', 'price'
            ]);
            $columns['created_at'] = date_create();
            $adId = DB::table('ads')->insertGetId($columns);

            $isFirstPhoto = true;
            foreach ($validated['photos'] as $photo) {
                DB::table('photos')->insert([
                    'url' => $photo,
                    'ad_id' => $adId,
                    'first' => $isFirstPhoto
                ]);
                $isFirstPhoto = false;
            }

            return $adId;
        });

        return response()->json(['id' => $adId]);
    }
}
