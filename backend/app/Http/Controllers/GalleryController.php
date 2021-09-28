<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Aws\S3\S3Client;
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
        $galleries = Gallery::with("user", "thumbnail")->withCount("photos")->get();

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
        $gallery = Gallery::with(["user", "photos"])->find($id);

        if (!$gallery) {
            // No gallery found
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


    /**
     * Destroy a gallery
     * 
     * @param Request $request
     */
    public function destroy(Request $request)
    {
        // Validate
        try {
            $this->validate($request, [
                "gallery_id" => "required",
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Could not delete the gallery");
        }

        $galleryId = $request->input("gallery_id");
        $gallery = Gallery::find($galleryId);

        // Check if gallery exists
        if (!$gallery) {
            return $this->respondWithClientFailure(null, "Could not find the gallery to delete", 404);
        }

        // Check if the authenticated user has permission to delete the gallery.
        // - basically if they are the owner
        $userId = Auth::user()->id;
        $isOwner = $gallery->user_id === $userId;
        if (!$isOwner) {
            // Not the owner, prevent and 401 out!
            return $this->respondWithClientFailure(null, "Gallery could not be deleted. Unauthorized", 401);
        }

        // Delete all of the objects related to this gallery from the AWS S3 Bucket
        // Name and region of the bucket where the gallery is stored
        $bucketName = "tccsimagegallery";
        $bucketRegion = "us-east-2";

        // Path to the directory of the gallery
        $galleryDirectoryPath = "galleries/$galleryId";

        // Create the client: Credentials are infered from the Environment Variables
        $s3Client = new S3Client([
            'version'     => "latest",
            'region'      => $bucketRegion
        ]);
        // Delete the gallery directory
        $s3Client->deleteMatchingObjects($bucketName, $galleryDirectoryPath);

        // Delete the gallery from the table
        $gallery->delete();

        // Respond
        return $this->respondWithSuccess(null, 200);
    }
}
