<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Admin extends Controller
{
    // ADMIN DASHBOARD
    public function index()
    {
        // CHECK IF ADMIN IS LOGGED IN
        if (!session()->get('isLoggedIn') || session()->get('role') !== 'admin') {
            return redirect()->to('/login');
        }

        // LOAD USER MODEL
        $userModel = new UserModel();

        // GET PAGINATED USERS AND PAGER
        $data = [
            'users' => $userModel->paginate(3, 'users'), // 3 USERS PER PAGE
            'pager' => $userModel->pager
        ];

        // LOAD ADMIN HOME VIEW
        return view('admin_home', $data);
    }

    // DELETE USER
    public function delete($id)
    {
        // LOAD USER MODEL
        $userModel = new UserModel();

        // DELETE USER BY ID
        $userModel->delete($id);

        // SET SUCCESS MESSAGE AND REDIRECT
        session()->setFlashdata('success', 'User deleted successfully.');
        return redirect()->to('/admin');
    }
}
