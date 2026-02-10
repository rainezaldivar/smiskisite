<?php namespace App\Controllers;

use App\Models\ProductModel;

class Shop extends BaseController
{
    // ==== SHOP PAGE ====
    public function index()
    {
        // ==== LOAD PRODUCT MODEL ====
        $productModel = new ProductModel();

        // ==== FETCH ALL PRODUCTS ====
        // We removed ->where('category', ...) so ALL items (Figures, Others, etc.) are fetched.
        // We put them ALL into $data['products'] so the view loop can see them.
        $data['products'] = $productModel->orderBy('id', 'DESC')->findAll();

        // ==== LOAD SHOP VIEW ====
        return view('shop', $data);
    }
}