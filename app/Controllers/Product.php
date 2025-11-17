<?php namespace App\Controllers;

class Product extends BaseController
{
    public function index()
    {
        return view('product'); // LOADS THE PRODUCT VIEW
    }
}
