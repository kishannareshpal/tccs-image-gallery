<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use stdClass;

class Gallery extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "galleries";

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ["photos_count", "thumbnail_url"];



    /**
     * Get the number of photos related with this gallery.
     * 
     * @return int
     */
    public function getPhotosCountAttribute()
    {
        return $this->photos()->count();
    }

    /**
     * Get the thumbnail for the gallery.
     * Uses the first photo in the gallery as the thumbnail.
     * 
     * @return int
     */
    public function getThumbnailUrlAttribute()
    {
        // Grab the first photo of this gallery and use it as the gallery's thumbnail.
        $thumbnailPhoto = $this->photos()->first();
        if (!$thumbnailPhoto) {
            // No photos on this gallery yet, so no thumbnail as well
            return null;
        }
        // Thumbnail's thumbnail url!!
        return $thumbnailPhoto->thumbnail_url;
    }


    /**
     * Get the user that owns the gallery.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function thumbnail()
    {
        return $this->hasOne(Photo::class);
    }

    /**
     * Get the photos that belong to the gallery
     */
    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}
