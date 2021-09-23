<?php

namespace App\Http\Controllers;

use Exception;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Return this response when the api is successful
     *
     * @param object|array|null $data Acts as the wrapper for any data returned by the API call. If the call returns no data (as in the last example), `data` should be set to `null`.
     * @param int $statusCode HTTP success status code between 200-299
     * @throws Exception When HTTP status code is out of the http success code range.
     *
     * @example Get list of Things
     *  {
     *      status: "success",
     *      code: 200,
     *      data: {            
     *          "posts": [
     *              { "id": 1, "title": "A blog post", "body": "Some useful content" },
     *              { "id": 2, "title": "Another blog post", "body": "More content" },
     *          ]
     *      }
     *  }
     * @example Get a Thing
     *  {
     *      status: "success",
     *      code: 200,
     *      data: { "post": { "id": 2, "title": "Another blog post", "body": "More content" }}
     *  }
     * @example Delete a Thing
     *  {
     *      status: "success",
     *      code: 200,
     *      data: null
     *  }
     */
    public function respondWithSuccess($data, $statusCode = 200)
    {
        // Validate status code
        if (($statusCode < 200) || ($statusCode > 299)) {
            // The http status code is out of the standard server related error codes
            throw new Exception("Please specify a valid Success HTTP statusCode (that is between 200-299). You provided `" . $statusCode . "`");
        }

        return response()->json(
            [
                "status" => "success",
                "code" => $statusCode,
                "data" => $data
            ],
            $statusCode
        );
    }


    /**
     * Return this response when there the failure is client-side.
     * - There was a problem with the data submitted, or some pre-condition of the API call wasn't satisfied
     *
     * @param object|array $data When an API call is rejected due to invalid data or call conditions, the data key contains an object explaining what went wrong, typically a hash of validation errors
     * @param string $message A meaningful, end-user-readable (or at the least log-worthy) message, explaining why it failed.
     * @param int $statusCode HTTP server status code between 400-499
     * @throws Exception When HTTP status code is out of the http client error code range.
     *
     * @example An example response (trying to create a blog post)
     *  {
     *      "status": "client_error",
     *      "code": 400,
     *      "message": null,
     *      "data": { "title" : "A title is required" }
     *  }
     *
     */
    public function respondWithClientFailure($data, $message = null, $statusCode = 400)
    {
        // Validate status code
        if (($statusCode < 400) || ($statusCode > 499)) {
            // The http status code is out of the standard server related error codes
            throw new Exception("Please specify a valid Client Error HTTP status code (that is between 400-499). You provided `" . $statusCode . "`");
        }

        return response()->json(
            [
                "status" => "client_error",
                "code" => $statusCode,
                "message" => $message,
                "data" => $data
            ],
            $statusCode
        );
    }


    /**
     * Return this reponse when there the error is server-side
     *
     * @param string $message A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong with the server
     * @param int $statusCode HTTP status code between 500-599
     * @throws Exception When HTTP status code is out of the http server error code range.
     *
     * @example
     *  {
     *      "status": "server_error",
     *      "code": 500,
     *      "message": "Unable to communicate with database"
     *  }
     */
    public function respondWithServerError($message, $statusCode = 500)
    {
        // Validate status code
        if (($statusCode < 500) || ($statusCode > 599)) {
            // The http status code is out of the standard server related error codes
            throw new Exception("Please specify a valid Server Error HTTP status code (that is between 500-599). You provided `" . $statusCode . "`");
        }

        return response()->json(
            [
                "status" => "server_error",
                "code" => $statusCode,
                "message" => $message
            ],
            $statusCode
        );
    }
}
