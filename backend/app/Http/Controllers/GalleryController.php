<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\facades\Auth;
use Illuminate\Validation\ValidationException;

class GalleryController extends Controller
{
    /**
     * Retrieve all galleries
     */
    public function list()
    {
        $galleries = Gallery::all();

        // Return the galleries
        $data = [
            "galleries" => $galleries
        ];
        return $this->respondWithSuccess($data);
    }

    /**
     * Retrieve a single gallery by it's ID
     * 
     * @param int $id gallery ID
     */
    public function show($id)
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            // Not found
            return $this->respondWithClientFailure(null, "Gallery not found", 404);
        }

        // Return the gallery
        $data = [
            "gallery" => $gallery
        ];
        return $this->respondWithSuccess($data);
    }

    /**
     * Create a new gallery
     * 
     * @param Request $request
     */
    public function store(Request $request)
    {
        // Validate
        try {
            $this->validate($request, [
                "title" => "required|string|max:70",
                "description" => "string|max:300|nullable"
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Please review the gallery details");
        }

        // Grab the authenticated user
        $user = Auth::user();

        // Grab the gallery details 
        $title = $request->input("title");
        $description = $request->input("description");

        // Save
        $gallery = new Gallery();
        $gallery->title = $title;
        if (isset($description)) {
            $gallery->description = $description;
        }
        $gallery->user_id = $user->id;
        $gallery->save();

        // Return it
        $data = [
            "gallery" => $gallery
        ];
        return $this->respondWithSuccess($data);
    }
}
