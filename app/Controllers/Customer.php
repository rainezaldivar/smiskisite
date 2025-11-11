<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    public function index()
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $model = new ProductModel();

        $data['products'] = $model->where('category', 'Figurines')->orderBy('id', 'DESC')->findAll();
        $data['others']   = $model->where('category', 'Others')->orderBy('id', 'DESC')->findAll();

        return view('customer_home', $data);
    }

    public function profile()
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $userModel = new UserModel();
        $userId    = session()->get('id');

        $data['user'] = $userModel->find($userId);

        return view('profile', $data);
    }
}
