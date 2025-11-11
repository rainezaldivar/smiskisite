<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
    // LOGIN PAGE
    public function login()
    {
        helper(['form']);
        echo view('login');
    }

    // LOGIN AUTHENTICATION
    public function loginAuth()
    {
        helper(['form']);

        // VALIDATION RULES
        $rules = [
            'email'    => 'required',
            'password' => 'required'
        ];

        // CHECK VALIDATION
        if (!$this->validate($rules)) {
            return view('login', ['validation' => $this->validator]);
        }

        $session   = session();
        $userModel = new UserModel();

        $email    = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        // FETCH USER BY EMAIL OR USERNAME
        $data = $userModel
            ->groupStart()
            ->where('email', $email)
            ->orWhere('name', $email)
            ->groupEnd()
            ->first();

        if (!$data) {
            // NO ACCOUNT FOUND
            return redirect()->back()->with('error', 'Account not found. Please register first.');
        }

        $hashedPassword = $data['password'];

        // CHECK PASSWORD
        if (password_verify($password, $hashedPassword) || $password === $hashedPassword) {

            // SET SESSION
            $session->set([
                'id'         => $data['id'],
                'name'       => $data['name'],
                'email'      => $data['email'],
                'role'       => $data['role'],
                'isLoggedIn' => true
            ]);

            // REDIRECT BASED ON ROLE
            return $data['role'] === 'admin'
                ? redirect()->to('/admin')->with('success', 'Welcome back, Admin!')
                : redirect()->to('/customer')->with('success', 'Login successful! Welcome back.');
        }

        // WRONG PASSWORD
        return redirect()->back()->with('error', 'Incorrect password. Please try again.');
    }

    // REGISTER PAGE
    public function register()
    {
        helper(['form']);
        echo view('register');
    }

    // SAVE NEW USER
    public function save()
    {
        helper(['form']);

        // VALIDATION RULES
        $rules = [
            'name'     => 'required|min_length[3]|max_length[50]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[5]'
        ];

        // CHECK VALIDATION
        if (!$this->validate($rules)) {
            return view('register', ['validation' => $this->validator]);
        }

        $userModel = new UserModel();

        // CREATE USER DATA
        $data = [
            'name'     => $this->request->getVar('name'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'role'     => 'customer'
        ];

        $userModel->insert($data);

        // AUTO-LOGIN NEW USER
        $session = session();
        $session->set([
            'id'         => $userModel->insertID(),
            'name'       => $data['name'],
            'email'      => $data['email'],
            'role'       => 'customer',
            'isLoggedIn' => true
        ]);

        return redirect()->to('/customer')->with('success', 'Registration successful! Welcome to your dashboard.');
    }

    // LOGOUT USER
    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login')->with('success', 'You have logged out successfully.');
    }
}
