<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    public function index()
    {
        // Require login
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

        // Load homepage
        return view('customer_home', $data);
    }

    public function profile()
    {
        // Require login
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        // Load user info from database
        $userModel = new UserModel();
        $userId = session()->get('id'); // Session should contain this
        $userData = $userModel->find($userId);

        if (!$userData) {
            return redirect()->to('/logout');
        }

        $data['user'] = $userData;
        return view('profile', $data);
    }
}
