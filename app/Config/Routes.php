<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// =================================================================
// 1. PUBLIC ROUTES (Accessible by Guests & Users)
// =================================================================

// Landing Page & Auth
$routes->get('/', 'Customer::index'); 
$routes->get('/login', 'Auth::login');
$routes->post('/loginAuth', 'Auth::loginAuth');
$routes->get('/register', 'Auth::register');
$routes->post('/save', 'Auth::save');
$routes->get('/logout', 'Auth::logout'); // Logout is public so users can exit
$routes->get('/auth/verify-email/(:any)', 'Auth::verifyEmail/$1');

// Shop Pages (Visible to Guests)
// These allow guests to browse without logging in
$routes->get('/customer', 'Customer::index'); 
$routes->get('/customer/home', 'Customer::index');
$routes->get('/customer/shop', 'Shop::index');
$routes->get('/customer/product', 'Product::index');
$routes->get('/customer/about', 'About::index');


// =================================================================
// 2. PROTECTED ROUTES (Redirect to Login if Guest)
// =================================================================

// We group these routes and apply the 'auth' filter.
// If a guest tries to access any URL inside this group, they go to /login.

$routes->group('', ['filter' => 'auth'], function($routes) {
    
    // Profile Management
    $routes->get('/profile', 'Profile::index');
    $routes->get('/customer/profile', 'Profile::index'); // Fixed: pointed to Profile controller standard
    $routes->post('profile/uploadProfilePicture', 'Profile::uploadProfilePicture');
    $routes->get('profile/picture/(:any)', 'Profile::profilePicture/$1');

    // Cart & Checkout (Add these if you have them ready)
    $routes->get('/cart', 'Cart::index');
    $routes->get('/checkout', 'Cart::checkout');

    // Admin Routes (Protected)
    // Note: You might want a separate 'admin' filter later for security, 
    // but for now, this stops guests from seeing it.
    $routes->get('/admin', 'Admin::index');
    $routes->get('/admin/delete/(:num)', 'Admin::delete/$1');
});