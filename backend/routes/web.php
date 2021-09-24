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


    /**
     * Gallery Routes
     */
    $router->get("galleries", "GalleryController@list");
    $router->get("galleries/{id}", "GalleryController@show");

    $router->group(["middleware" => "auth"], function () use ($router) {
        $router->post("galleries", "GalleryController@store");
    });
});
