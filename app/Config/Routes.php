<?php

namespace Config;

$routes = Services::routes();

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Customer');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

// =================================================================
// 1. PUBLIC ROUTES
// =================================================================

$routes->get('/', 'Customer::index'); 
$routes->get('/login', 'Auth::login');
$routes->post('/loginAuth', 'Auth::loginAuth');
$routes->get('/register', 'Auth::register');
$routes->post('/save', 'Auth::save');
$routes->get('/logout', 'Auth::logout');
$routes->get('/auth/verify-email/(:any)', 'Auth::verifyEmail/$1');

$routes->get('/details', 'Catalog::details');
$routes->get('details', 'Catalog::details');

$routes->get('/customer', 'Customer::index'); 
$routes->get('/customer/home', 'Customer::index');
$routes->get('/customer/catalog', 'Catalog::index');
$routes->get('/customer/about', 'About::index');
$routes->get('/customer/shop', 'Shop::index');          
$routes->get('/customer/cart', 'Shop::cart');           

$routes->post('/shop/add', 'Shop::add');                
$routes->get('/shop/remove/(:num)', 'Shop::remove/$1'); 

// FIXED: This matches the links correctly now
$routes->get('/shop/product/(:num)', 'Shop::viewProduct/$1'); 

$routes->get('/shop/checkout', 'Shop::checkout'); 
$routes->post('/shop/checkout', 'Shop::checkout');

// FIXED: Added the route for the "Buy Now" button
$routes->post('/shop/directCheckout', 'Shop::directCheckout');

$routes->post('/shop/placeOrder', 'Shop::placeOrder');
$routes->post('cart/update', 'Cart::update');
$routes->get('cart/remove/(:segment)', 'Cart::remove/$1');

// =================================================================
// 2. PROTECTED ROUTES
// =================================================================

$routes->group('', ['filter' => 'auth'], function($routes) {
    $routes->get('/profile', 'Profile::index');
    $routes->get('/customer/profile', 'Profile::index'); 
    $routes->post('/profile/uploadProfilePicture', 'Profile::uploadProfilePicture');
    $routes->post('/profile/updateDetails', 'Profile::updateDetails');
    $routes->get('/profile/picture/(:any)', 'Profile::profilePicture/$1');

    $routes->get('/admin', 'Admin::index');
    $routes->get('/admin/delete/(:num)', 'Admin::delete/$1');
});

if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}