<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Admin extends Controller
{
    public function index()
    {
        if (!session()->get('isLoggedIn') || session()->get('role') !== 'admin') return redirect()->to('/login');
        $userModel = new UserModel();
        $data['users'] = $userModel->findAll();
        echo view('admin_home', $data);
    }

    public function delete($id)
    {
        $userModel = new UserModel();
        $userModel->delete($id);
        return redirect()->to('/admin');
    }
}
