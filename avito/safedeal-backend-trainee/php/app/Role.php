<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    public const SELLER_ROLE = 'seller';

    public const CUSTOMER_ROLE = 'customer';

    public const COURIER_ROLE = 'courier';

    /**
     * Get users that have this role.
     *
     * @return BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
