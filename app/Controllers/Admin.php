<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Admin extends Controller
{
    public function index()
    {
        // Only allow admin users
        if (!session()->get('isLoggedIn') || session()->get('role') !== 'admin') {
            return redirect()->to('/login');
        }

        $userModel = new UserModel();

        // Get paginated users and pager
        $data = [
            'users' => $userModel->paginate(3, 'users'),
            'pager' => $userModel->pager
        ];

        return view('admin_home', $data);
    }

    public function delete($id)
    {
        $userModel = new UserModel();
        $userModel->delete($id);

        session()->setFlashdata('success', 'User deleted successfully.');
        return redirect()->to('/admin');
    }
}
