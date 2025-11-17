<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
    // ===== LOGIN PAGE =====
    public function login()
    {
        helper(['form']); // LOAD FORM HELPER FOR LOGIN FORM
        echo view('login'); // SHOW LOGIN PAGE
    }

    // ===== LOGIN AUTHENTICATION =====
    public function loginAuth()
    {
        $session = session();
        $userModel = new UserModel();

        // === GET USER INPUT FROM LOGIN FORM ===
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $userModel->where('email', $email)->first(); // FIND USER BY EMAIL

        if ($user) {
            $hashedPassword = $user['password'];

            // CHECK IF PASSWORD MATCHES
            if (password_verify($password, $hashedPassword) || $password === $hashedPassword) {

                // === SET SESSION DATA ===
                $session->set([
                    'id'         => $user['id'],
                    'name'       => $user['name'],
                    'email'      => $user['email'],
                    'role'       => $user['role'],
                    'isLoggedIn' => true
                ]);

            // ==== SET WELCOME FLASH MESSAGE ====
            if ($user['role'] === 'admin') {
                $session->setFlashdata('success', 'Welcome back, Admin!');
                return redirect()->to('/admin');
            } elseif ($user['role'] === 'customer') {
                $session->setFlashdata('success', 'Welcome back, ' . $user['name'] . '!');
                return redirect()->to('/customer'); // redirect customers
            } else {
                // optional: handle other roles if you have them
                return redirect()->to('/login');
            }

        } else {
            $session->setFlashdata('error', 'Wrong password.');
            return redirect()->to('/login');
        }
    } else {
        $session->setFlashdata('error', 'Email not found.');
        return redirect()->to('/login');
    }
}

    // ===== REGISTER PAGE =====
    public function register()
    {
        helper(['form']); // LOAD FORM HELPER FOR REGISTRATION
        echo view('register'); // SHOW REGISTER PAGE
    }

    // ===== SAVE NEW USER =====
    public function save()
    {
        helper(['form']); // LOAD FORM HELPER

        // ===== VALIDATION RULES =====
        $rules = [
            'name'     => 'required|min_length[3]|max_length[50]',
            'email'    => 'required|valid_email|is_unique[users.email]|max_length[100]',
            'password' => 'required|min_length[5]|max_length[255]',
        ];

        if (!$this->validate($rules)) {
            return view('register', ['validation' => $this->validator]); // SHOW VALIDATION ERRORS
        }

        try {
            $userModel = new UserModel();
            $password = $this->request->getVar('password');
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $data = [
                'name'     => $this->request->getVar('name'),
                'email'    => $this->request->getVar('email'),
                'password' => $hashedPassword,
                'role'     => 'customer',
            ];

            if ($userModel->insert($data)) {

                // === AUTO LOGIN AFTER REGISTRATION ===
                $user = $userModel->where('email', $data['email'])->first();
                $session = session();
                $session->set([
                    'id'         => $user['id'],
                    'name'       => $user['name'],
                    'email'      => $user['email'],
                    'role'       => $user['role'],
                    'isLoggedIn' => true
                ]);

                // ===== SEND WELCOME EMAIL =====
                $this->sendWelcomeEmail($data['email'], $data['name']);

                return redirect()->to('/customer'); // redirect to customer page
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to create account. Please try again.')
                    ->withInput();
            }
        } catch (\Exception $e) {
            log_message('error', '[Registration Error] '.$e->getMessage());
            return redirect()->back()
                ->with('error', 'An error occurred during registration. Please try again.')
                ->withInput();
        }
    }

    // ===== WELCOME EMAIL FUNCTION =====
    private function sendWelcomeEmail($email, $name)
    {
        $emailService = \Config\Services::email();
        $email = trim($email);

        $message = '
            <table width="100%" style="background:#f4f4f4; padding:40px 0; font-family:Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <table width="500" style="background:#fff; border-radius:10px; overflow:hidden;">
                            <!-- HEADER -->
                            <tr>
                                <td align="center" style="background: linear-gradient(90deg, #2d7a1f, #4a9e32); padding:20px;">
                                    <img src="https://smiski.com/e/wp-content/uploads/2016/03/top_logo.png" 
                                         width="200" 
                                         alt="Smiski Logo" 
                                         style="display:block;">
                                </td>
                            </tr>

                            <!-- TITLE -->
                            <tr>
                                <td align="center" style="padding:30px 20px 10px;">
                                    <h2>Welcome to Smiski Shop, '.$name.'! 💚</h2>
                                </td>
                            </tr>

                            <!-- MESSAGE BODY -->
                            <tr>
                                <td align="center" style="padding:0 30px 30px; color:#555; font-size:16px;">
                                    <p>We’re excited to have you join our Smiski family! Your account is ready.</p>
                                    <p>Explore adorable Smiski figures, shop exclusive drops, and enjoy a smooth shopping experience.</p>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td align="center" style="background:#f0f0f0; padding:20px; font-size:13px; color:#777;">
                                    <small>This is a school project from FEU Institute of Technology.</small>
                                    <p>© 2025 Rzeecola / Raiii Zee — All Rights Reserved.</p>
                                    <h6 style="margin:5px 0; font-weight:normal;">Made with 💚 as a Smiski fan.</h6>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>';

        $emailService->setTo($email);
        $emailService->setFrom('rainez333@gmail.com', 'Smiski Shop');
        $emailService->setSubject('Welcome to Smiski Shop!');
        $emailService->setMessage($message);

        if (!$emailService->send()) {
            log_message('error', 'Email failed to send to: '.$email);
        }
    }

    // ===== LOGOUT USER =====
    public function logout()
    {
        session()->destroy(); // destroy all session data
        return redirect()->to('/login'); // redirect to login page
    }
}
