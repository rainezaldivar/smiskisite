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
            ->findAll();

        // === Other Products ===
        $data['others'] = $model
            ->where('category', 'Others')
            ->orderBy('id', 'DESC')
            ->findAll();

        // Load the view
        return view('customer_home', $data);
    }

    public function profile() {
    $data['user'] = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'address' => '123 Main Street, Manila',
        'phone' => '09123456789',
        'created_at' => 'March 2024'
    ];

    return view('customer/profile', $data);
}

}
