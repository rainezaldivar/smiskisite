<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Admin extends Controller
{
    // ==== ADMIN DASHBOARD PAGE ====
    public function index()
    {
        // ==== CHECK IF ADMIN IS LOGGED IN ====
        if (!session()->get('isLoggedIn') || session()->get('role') !== 'admin') {
            return redirect()->to('/login'); // redirect to login if not admin
        }

        // ==== LOAD USER MODEL ====
        $userModel = new UserModel();

        // ==== GET USERS WITH PAGINATION (3 PER PAGE) ====
        $data = [
            'users' => $userModel->paginate(3, 'users'),
            'pager' => $userModel->pager
        ];

        // ==== LOAD ADMIN HOME VIEW AND PASS USERS DATA ====
        return view('admin_home', $data);
    }

    // ==== DELETE USER FUNCTION ====
    public function delete($id)
    {
        // ==== LOAD USER MODEL ====
        $userModel = new UserModel();

        // ==== DELETE USER BY ID ====
        $userModel->delete($id);

        // ==== SET SUCCESS MESSAGE AND REDIRECT BACK TO ADMIN DASHBOARD ====
        session()->setFlashdata('success', 'User deleted successfully.');
        return redirect()->to('/admin');
    }
}
