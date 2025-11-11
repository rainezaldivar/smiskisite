<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
    public function login()
    {
        helper(['form']);
        echo view('login');
    }

    public function loginAuth()
    {
        helper(['form']);

        $rules = [
            'email'    => 'required',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return view('login', ['validation' => $this->validator]);
        }

        $session   = session();
        $userModel = new UserModel();

        $email    = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        // Accept email OR username
        $data = $userModel
            ->groupStart()
            ->where('email', $email)
            ->orWhere('name', $email)
            ->groupEnd()
            ->first();

        if (!$data) {
            // No account found
            return redirect()->back()->with('error', 'Account not found. Please register first.');
        }

        $hashedPassword = $data['password'];

        if (password_verify($password, $hashedPassword) || $password === $hashedPassword) {

            // Save session
            $session->set([
                'id'         => $data['id'],
                'name'       => $data['name'],
                'email'      => $data['email'],
                'role'       => $data['role'],
                'isLoggedIn' => true
            ]);

            // Redirect based on role
            return $data['role'] === 'admin'
                ? redirect()->to('/admin')->with('success', 'Welcome back, Admin!')
                : redirect()->to('/customer')->with('success', 'Login successful! Welcome back.');
        }

        // Wrong password
        return redirect()->back()->with('error', 'Incorrect password. Please try again.');
    }

    public function register()
    {
        helper(['form']);
        echo view('register');
    }

    public function save()
    {
        helper(['form']);

        $rules = [
            'name'     => 'required|min_length[3]|max_length[50]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[5]'
        ];

        if (!$this->validate($rules)) {
            return view('register', ['validation' => $this->validator]);
        }

        $userModel = new UserModel();

        $data = [
            'name'     => $this->request->getVar('name'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'role'     => 'customer'
        ];

        $userModel->insert($data);

        // Auto-login new user
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

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login')->with('success', 'You have logged out successfully.');
    }
}
