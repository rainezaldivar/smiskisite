<?php namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    // ==== DATABASE TABLE NAME ====
    protected $table = 'products';

    // ==== FIELDS ALLOWED FOR MASS ASSIGNMENT ====
    protected $allowedFields = [
        'name',        // ==== PRODUCT NAME ====
        'price',       // ==== PRODUCT PRICE ====
        'description', // ==== PRODUCT DESCRIPTION ====
        'image',       // ==== PRODUCT IMAGE ====
        'category',    // ==== PRODUCT CATEGORY ====
        'stock'        // ==== PRODUCT STOCK QUANTITY ====
    ];
}
