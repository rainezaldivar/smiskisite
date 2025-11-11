<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    // CUSTOMER HOME PAGE
    public function index()
    {
        // CHECK IF USER IS LOGGED IN
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        // LOAD PRODUCT MODEL
        $model = new ProductModel();

        // FETCH PRODUCTS BY CATEGORY
        $data['products'] = $model->where('category', 'Figurines')
                                   ->orderBy('id', 'DESC')
                                   ->findAll();
        $data['others']   = $model->where('category', 'Others')
                                   ->orderBy('id', 'DESC')
                                   ->findAll();

        // LOAD CUSTOMER HOME VIEW
        return view('customer_home', $data);
    }

    // CUSTOMER PROFILE 
    public function profile()
    {
        // CHECK IF USER IS LOGGED IN
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        // LOAD USER MODEL
        $userModel = new UserModel();
        $userId    = session()->get('id');

        // FETCH CURRENT USER DATA
        $data['user'] = $userModel->find($userId);

        // LOAD PROFILE VIEW
        return view('profile', $data);
    }
}
