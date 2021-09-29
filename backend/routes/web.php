<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->group(["prefix" => "api"], function () use ($router) {

    /**
     * User routes
     */
    $router->post("login", "AuthController@login");
    $router->post("register", "AuthController@register");
    $router->post("logout", "AuthController@logout");
    $router->get("users/{username}", "UserController@profile");


    /**
     * Gallery Routes
     */
    $router->get("galleries", "GalleryController@list");
    $router->get("galleries/{id}", "GalleryController@show");


    /**
     * Authenticated Routes
     */
    $router->group(["middleware" => "auth"], function () use ($router) {
        $router->post("galleries", "GalleryController@store");
        $router->put("galleries/{id}", "GalleryController@update");
        $router->post("galleries/delete", "GalleryController@destroy");
        $router->post("galleries/photos/delete", "PhotoController@destroy");
        $router->post("galleries/{id}/photos", "PhotoController@store");
    });
});
