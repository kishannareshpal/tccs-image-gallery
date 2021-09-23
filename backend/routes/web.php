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
});
