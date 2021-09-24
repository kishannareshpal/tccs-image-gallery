<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->group(["prefix" => "api"], function () use ($router) {

    /**
     * Authentication routes
     */
    $router->post("login", "AuthController@login");
    $router->post("register", "AuthController@register");
    $router->post("logout", "AuthController@logout");

    $router->get("galleries", "GalleryController@listAll");
    $router->get("galleries/{id}", "GalleryController@show");

    $router->group(["middleware" => "auth"], function () use ($router) {
        $router->post("galleries", "GalleryController@store");
    });
});
