<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{

    /**
     * Get the user information as well as their galleries, via USERNAME
     * @param string $username user's username
     */
    public function profile($username)
    {
        // Get the user with the specified username
        $user = User::where("username", $username)->first();
        if (!isset($user)) {
            // No user with the specified username was found
            return $this->respondWithClientFailure(null, "The account does not exist", 404);
        }

        $user = $user->with(["galleries", "galleries.thumbnail"])->get()->first();

        $data = [
            "user" => $user
        ];
        return $this->respondWithSuccess($data);
    }

    /**
     * List all of the user's galleries
     * 
     * @param string $username user's username
     */
    public function listGalleries($username)
    {
        // Get the user with the specified username
        $user = User::where("username", $username)->first();
        if (!isset($user)) {
            // No user with the specified username was found
            return $this->respondWithClientFailure(null, "The account does not exist", 404);
        }

        // Return the galleries that belongs to the user
        // $galleries = $user->galleries()->with("user")->get();
        $galleries = $user->galleries;
        $data = [
            "galleries" => $galleries
        ];
        return $this->respondWithSuccess($data);
    }
}
