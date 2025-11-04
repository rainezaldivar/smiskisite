<?php namespace App\Controllers;

use App\Models\ProductModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    public function index()
    {
        // Check login session
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $model = new ProductModel();

        // === Figurine Products ===
        $data['products'] = $model
            ->where('category', 'Figurines')
            ->orderBy('id', 'DESC')
            ->findAll(16);

        // === Other Products ===
        $data['others'] = $model
            ->where('category', 'Others')
            ->orderBy('id', 'DESC')
            ->findAll(16);

        // Load the view
        return view('customer_home', $data);
    }
}
