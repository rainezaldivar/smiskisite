<?php namespace App\Controllers;

use App\Models\ProductModel;

class Shop extends BaseController
{
    // ==== SHOP PAGE ====
    public function index()
    {
        // ==== LOAD PRODUCT MODEL ====
        $productModel = new ProductModel();

        // ==== FETCH PRODUCTS IN FIGURINES CATEGORY ====
        $data['products'] = $productModel->where('category', 'Figurines')
                                         ->orderBy('id', 'DESC')
                                         ->findAll();

        // ==== FETCH PRODUCTS IN OTHERS CATEGORY ====
        $data['others'] = $productModel->where('category', 'Others')
                                       ->orderBy('id', 'DESC')
                                       ->findAll();

        // ==== LOAD SHOP VIEW WITH PRODUCTS DATA ====
        return view('shop', $data);
    }
}
