<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Auth::login');
$routes->get('/login', 'Auth::login');
$routes->post('/loginAuth', 'Auth::loginAuth');
$routes->get('/register', 'Auth::register');
$routes->post('/save', 'Auth::save');
$routes->get('/logout', 'Auth::logout');

$routes->get('/customer', 'Customer::index');
$routes->get('/admin', 'Admin::index');
$routes->get('/admin/delete/(:num)', 'Admin::delete/$1');
