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
        $session = session();
        $userModel = new UserModel();

        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $data = $userModel->where('email', $email)->first();

        if ($data) {
            $hashedPassword = $data['password'];

            // Allow both hashed and plain passwords
            if (password_verify($password, $hashedPassword) || $password === $hashedPassword) {
                $session->set([
                    'id'         => $data['id'],
                    'name'       => $data['name'],
                    'email'      => $data['email'],
                    'role'       => $data['role'],
                    'isLoggedIn' => true
                ]);

                // Redirect based on role
                return $data['role'] === 'admin'
                    ? redirect()->to('/admin')
                    : redirect()->to('/customer');
            } else {
                $session->setFlashdata('error', 'Wrong password.');
                return redirect()->to('/login');
            }
        } else {
            $session->setFlashdata('error', 'Email not found.');
            return redirect()->to('/login');
        }
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
        'email'    => 'required|valid_email|is_unique[users.email]|max_length[100]',
        'password' => 'required|min_length[5]|max_length[255]',
    ];

    if (!$this->validate($rules)) {
        return view('register', [
            'validation' => $this->validator
        ]);
    }

    try {
        $userModel = new UserModel();
        $data = [
            'name'     => $this->request->getVar('name'),
            'email'    => $this->request->getVar('email'),
            'password' => $this->request->getVar('password'),
            'role'     => 'customer'
        ];
        
        if ($userModel->insert($data)) {
            $session = session();
            $newUser = $userModel->where('email', $data['email'])->first();
            
            $session->set([
                'id'         => $newUser['id'],
                'name'       => $newUser['name'],
                'email'      => $newUser['email'],
                'role'       => $newUser['role'],
                'isLoggedIn' => true
            ]);
            
            return redirect()->to('/customer');
        } else {
            return redirect()->back()
                ->with('error', 'Failed to create account. Please try again.')
                ->withInput();
        }
    } catch (\Exception $e) {
        log_message('error', '[Registration Error] {exception}', ['exception' => $e->getMessage()]);
        return redirect()->back()
            ->with('error', 'An error occurred during registration. Please try again.')
            ->withInput();
    }
}


    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login');
    }
}
