<?php namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    // DATABASE TABLE NAME
    protected $table = 'products';

    // FIELDS ALLOWED FOR MASS ASSIGNMENT
    protected $allowedFields = [
        'name',
        'price',
        'description',
        'image',
        'category',
        'stock'
    ];
}
