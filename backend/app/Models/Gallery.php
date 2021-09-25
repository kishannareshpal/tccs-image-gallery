<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "galleries";


    /**
     * Get the user that owns the gallery.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the photos that belong to the gallery
     */
    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}
