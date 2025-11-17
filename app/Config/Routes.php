<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// === LOGIN AND REGISTRATION ROUTES ===
$routes->get('/', 'Auth::login');
$routes->get('/login', 'Auth::login');
$routes->post('/loginAuth', 'Auth::loginAuth');
$routes->get('/register', 'Auth::register');
$routes->post('/save', 'Auth::save');
$routes->get('/auth/verify-email/(:any)', 'Auth::verifyEmail/$1');
$routes->get('/logout', 'Auth::logout');

// === CUSTOMER ROUTES ===
$routes->get('/customer', 'Customer::index');
$routes->get('/customer/home', 'Customer::index');
$routes->get('/customer/profile', 'Customer::profile');
$routes->get('/customer/shop', 'Shop::index');
$routes->get('/customer/product', 'Product::index');
$routes->get('/customer/about', 'About::index');

// === PROFILE ROUTES ===
$routes->get('/profile', 'Profile::index');
$routes->post('profile/uploadProfilePicture', 'Profile::uploadProfilePicture');
$routes->get('profile/picture/(:any)', to: 'Profile::profilePicture/$1');

// === ADMIN ROUTES ===
$routes->get('/admin', 'Admin::index');
$routes->get('/admin/delete/(:num)', 'Admin::delete/$1');
