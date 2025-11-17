<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    // ==== CUSTOMER HOME PAGE ====
    public function index()
    {
        // ==== CHECK IF USER IS LOGGED IN ====
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); // redirect to login if not logged in
        }

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

        // ==== LOAD CUSTOMER HOME VIEW WITH PRODUCTS DATA ====
        return view('customer_home', $data);
    }

    // ==== CUSTOMER PROFILE PAGE ====
    public function profile()
    {
        // ==== CHECK IF USER IS LOGGED IN ====
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); // redirect to login if not logged in
        }

        // ==== LOAD USER MODEL ====
        $userModel = new UserModel();
        $userId = session()->get('id'); // get current user ID

        // ==== FETCH CURRENT USER DATA ====
        $data['user'] = $userModel->find($userId);

        // ==== LOAD PROFILE VIEW WITH USER DATA ====
        return view('profile', $data);
    }
}
