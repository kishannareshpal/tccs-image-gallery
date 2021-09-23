<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Store a new user
     * @param Request $request
     */
    public function register(Request $request)
    {
        // Validate
        try {
            $this->validate($request, [
                "first_name" => "required|string|alpha|min:1|max:255",
                "last_name" => "required|string|alpha|min:1|max:255",
                "username" => "bail|required|alpha_num|unique:users|string|min:3|max:255",
                "email" => "bail|required|unique:users|email",
                "password" => "required|string|min:3"
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Please review your details");
        }

        // Credentials
        $firstName = $request->input("first_name");
        $lastName = $request->input("last_name");
        $username = $request->input("username");
        $email = $request->input("email");
        $password = $request->input("password");

        // Create user
        $user = new User();
        $user->first_name = $firstName;
        $user->last_name = $lastName;
        $user->username = $username;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->save();

        Auth::login($user);
        $token = JWTAuth::fromUser($user);
        if (!$token) {
            // Invalid user
            return $this->respondWithClientFailure(null, "Registered but was unable to login. Please login manually", 401);
        }

        // Return JWT
        return $this->respondWithToken($user->email, $user->full_name, $token, 201, "Authenticated");
    }


    /**
     * Login a user with username/email and password
     * @param Request $request
     */
    public function login(Request $request)
    {
        // Validate request
        try {
            $this->validate($request, [
                "email_username" => "required|string",
                "password" => "required|string"
            ]);
        } catch (ValidationException $e) {
            return $this->respondWithClientFailure($e->errors(), "Please review your details", 400);
        }

        // Grab the credentials from the request inputs
        $email_username = $request->input("email_username");
        $password = $request->input("password");

        // Attempt to authenticate the user with their email or username credentials
        $token = Auth::attempt([
            "email" => $email_username,
            "password" => $password
        ]);
        if (!$token) {
            // Email is not a match
            // Attempt via username
            $token = Auth::attempt([
                "username" => $email_username,
                "password" => $password
            ]);

            if (!$token) {
                // Username is also not a match
                // Incorrect credentials.
                return $this->respondWithClientFailure(null, "Incorrect email, username or password", 401);
            }
        }

        // Authenticate
        $user = Auth::user();
        return $this->respondWithToken($user->email, $user->full_name, $token, 201, "Authenticated");
    }


    /**
     * Logout the currently authenticated user
     */
    public function logout()
    {
        Auth::logout();
        return $this->respondWithSuccess(null);
    }


    /**
     * Response wrapper used for returning the user token after Register or Login
     *
     * @param token The jwt auth token
     * @param message A meaningful, end-user-readable message.
     * @param statusCode HTTP status code for this response.
     */
    public function respondWithToken($email, $full_name, $token, $statusCode, $message = null)
    {
        $data = [
            "user" => [
                "email" => $email,
                "full_name" => $full_name,
                "token" => $token,
                "token_type" => "bearer",
                "expires_in" => null,
            ],
            "message" => $message
        ];
        return $this->respondWithSuccess($data, $statusCode);
    }
}
