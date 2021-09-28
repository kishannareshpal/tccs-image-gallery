<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

use Aws\S3\S3Client;
use Aws\CommandInterface;
use Aws\CommandPool;
use Aws\Exception\AwsException;
use Aws\ResultInterface;
use Aws\S3\Exception\S3Exception;
use Carbon\Carbon;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Support\Carbon as SupportCarbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Facades\Image as FacadesImage;


class PhotoController extends Controller
{
    /**
     * Store photo(s) in a specific gallery
     * 
     * @param $id Gallery ID
     * @param Request $request
     */
    public function store(Request $request, $id)
    {
        // Validate
        try {
            $this->validate($request, [
                "photos" => "required",
                "photos.*" => "mimes:jpeg,jpg,png|max:8192"
            ], [
                'photos.required' => "You must choose the photo(s) you wish to upload",
                'photos.*.mimes' => "Only jpeg, jpg and png photos are allowed",
                'photos.*.max' => "Sorry! Maximum allowed size for each photo is 8MB",
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Could not upload the photos");
        }

        $user_id = Auth::user()->id;

        // Upload the images into AWS S3 Bucket
        // name of the bucket where the photos will be uploaded
        $bucketName = "tccsimagegallery";
        $bucketRegion = "us-east-2";
        // path to the directory where the photo will be uploaded in the s3 bucket
        $directoryPath = "galleries/${id}";

        // Create the client: Credentials are infered from the Environment Variables
        $s3Client = new S3Client([
            'version'     => "latest",
            'region'      => $bucketRegion
        ]);

        // Grab the photos files being uploaded
        $photos = $request->file("photos");

        // This array will hold the models added to db, which are the uploaded photos
        $uploaded_photos = [];

        /**
         * Generator function, which converts the Photos Files into Aws\CommandInterface objects.
         * 
         * @param \Iterator $photos The photos files being uploaded
         * @param string $bucketName AWS S3 bucket, where the photos will be put
         * @param string $directoryPath The path of the directory where the photo will be stored
         */
        $commandGenerator = function ($photos, $bucketName, $bucketRegion, $directoryPath) use ($s3Client, $user_id, $id, &$uploaded_photos) {
            foreach ($photos as $photo) {
                // Prepare the filename for the Photo
                $photoExt = $photo->extension(); // get the original photo's extension (png|jpg, etc)
                $timestamp = Carbon::today()->format("Y-m-d");

                // Add the photo to the table
                $p = new Photo();
                $p->user_id = $user_id;
                $p->gallery_id = $id;
                $p->save();

                // Get the ID of the row, and use that to create the unique name for the photo
                $photo_id = $p->id;
                $photoFileName = "{$timestamp}_{$photo_id}.$photoExt";

                // Update the row with the filename and direct url's for the original full size and thumbnail images
                $p->filename = $photoFileName;
                $p->full_size_url = "https://$bucketName.s3.$bucketRegion.amazonaws.com/$directoryPath/photos/$photoFileName";
                $p->thumbnail_url = "https://$bucketName.s3.$bucketRegion.amazonaws.com/$directoryPath/thumbnails/$photoFileName";
                $p->update();

                $uploaded_photos[] = $p;

                // Generate a 192x192 thumbnail for the photo
                $thumbnailPhotoStream = $this->createThumbnail($photo, 300);
                // Yield a command that will be executed by the pool (Upload 190x190 thumbnail of the image)
                yield $s3Client->getCommand('PutObject', [
                    "Bucket" => $bucketName,
                    "Key" => "$directoryPath/thumbnails/$photoFileName",
                    "Body" => $thumbnailPhotoStream,
                    "ACL" => "public-read"
                ]);

                // Yield a command that will be executed by the pool (Upload full size image)
                yield $s3Client->getCommand('PutObject', [
                    "Bucket" => $bucketName,
                    "Key" => "$directoryPath/photos/$photoFileName",
                    "SourceFile" => $photo,
                    "ACL" => "public-read"
                ]);
            }
        };

        // Generate the commands
        $commands = $commandGenerator($photos, $bucketName, $bucketRegion, $directoryPath);

        // Create the pool, by applying the generated commands
        $pool = new CommandPool($s3Client, $commands, [
            "concurrency" => 5 // only send 5 files at time
        ]);

        // Initiate the pool (upload)
        $promise = $pool->promise();
        $promise->wait(); // Synchronously

        $data = [
            "uploaded_photos" => $uploaded_photos
        ];
        return $this->respondWithSuccess($data);
    }


    /**
     * Delete a single photo in the gallery, by ID
     */
    public function destroy(Request $request)
    {
        // Validate
        try {
            $this->validate($request, [
                "photo_id" => "required",
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Could not delete the photo");
        }

        $photoId = $request->input("photo_id");
        $photo = Photo::find($photoId);

        // Check if photo exists
        if (!$photo) {
            return $this->respondWithClientFailure(null, "Could not find the photo to delete", 404);
        }

        // Check if the authenticated user has permission to delete the photo.
        // - basically if they are the owner
        $userId = Auth::user()->id;
        $isOwner = $photo->user_id === $userId;
        if (!$isOwner) {
            // Not the owner, prevent and 401 out!
            return $this->respondWithClientFailure(null, "Photo could not be deleted. Unauthorized", 401);
        }

        // Delete the object from the AWS S3 Bucket
        // name of the bucket where the photos located
        $bucketName = "tccsimagegallery";
        $bucketRegion = "us-east-2";
        // path to the directory where the photos are located in the s3 bucket
        $galleryID = $photo->gallery_id;
        $directoryPath = "galleries/$galleryID";

        // The name of the thumbnail and original size photos
        $photoFileName = $photo->filename;

        // Create the client: Credentials are infered from the Environment Variables
        $s3Client = new S3Client([
            'version'     => "latest",
            'region'      => $bucketRegion
        ]);

        /**
         * Generator function, which yields the thumbnail and the photo deletion Aws\CommandInterface objects.
         * 
         * @param \Iterator $photos The photos files being uploaded
         * @param string $bucketName AWS S3 bucket, where the photos will be put
         * @param string $directoryPath The path of the directory where the photo will be stored
         */
        $commandGenerator = function ($bucketName, $directoryPath, $photoFileName) use ($s3Client) {
            // Yield a command that will be executed by the pool (Deletes the thumbnail of the image)
            yield $s3Client->getCommand('DeleteObject', [
                "Bucket" => $bucketName,
                "Key" => "$directoryPath/thumbnails/$photoFileName",
            ]);

            // Yield a command that will be executed by the pool (Deletes the full size image)
            yield $s3Client->getCommand('DeleteObject', [
                "Bucket" => $bucketName,
                "Key" => "$directoryPath/photos/$photoFileName",
            ]);
        };

        // Generate the commands
        $commands = $commandGenerator($bucketName, $directoryPath, $photoFileName);

        // Create the pool, by applying the generated commands
        $pool = new CommandPool($s3Client, $commands, [
            "concurrency" => 2, // only send 5 files at time
        ]);
        // Initiate the pool (delete)
        $promise = $pool->promise();
        $promise->wait(); // Synchronously

        // Remove from db
        $photo->delete();

        // Return 200
        return $this->respondWithSuccess(null);
    }


    /**
     * Creates a thumbnail, by resizing the original photo to the target width and
     * the height will be scaled to maintain the orignal aspect ratio.
     * Encodes the file to PNG and returns a PSR-7 stream, which is used to upload to AWS S3.
     * 
     * @param $photo The uploaded photo file, to be resized
     * @param int $targetWidth The desired width of the image. The height will be scaled to maintain the original aspect ratio.
     * 
     * @return GuzzleHttp\Psr7\Stream PSR-7 JPG stream of the created thumbanail.
     */
    function createThumbnail($photo, $targetWidth)
    {
        $resizedImg = FacadesImage::make($photo)->resize($targetWidth, $targetWidth, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $thumbnailStream = $resizedImg->stream();
        return $thumbnailStream;
    }
}
