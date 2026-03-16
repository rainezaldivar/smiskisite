<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Profile extends Controller
{
    protected $userModel;

    public function __construct() {
        helper(['form', 'url']);
        $this->userModel = new UserModel();
    }

    public function index() {
        if (!session()->get('isLoggedIn')) return redirect()->to('/login');
        return view('profile', ['user' => $this->userModel->find(session()->get('id'))]);
    }

    public function uploadProfilePicture() {
        $file = $this->request->getFile('profile_picture');

        if (!$file->isValid() || $file->getSizeByUnit('mb') > 5) {
            return redirect()->back()->with('error', 'Upload failed! Ensure the file is an image and less than 5MB.');
        }

        try {
            $newName = $file->getRandomName();
            $uploadPath = FCPATH . 'uploads/'; 
            
            if (!is_dir($uploadPath)) { mkdir($uploadPath, 0777, true); }
            $file->move($uploadPath, $newName);

            $db = \Config\Database::connect();
            $db->table('users')->where('id', session()->get('id'))->update(['profile_picture' => $newName]);
            
            session()->set('profile_picture', $newName);
            return redirect()->to('/profile')->with('success', 'Profile picture updated successfully!');
        } catch (\Exception $e) {
            return redirect()->to('/profile')->with('error', 'Upload Error: ' . $e->getMessage());
        }
    }

    public function updateDetails() {
        try {
            $data = $this->request->getPost();
            
            if (!empty($data)) {
                // Para hindi mag-error kapag blanko ang birthday
                if (empty($data['dob'])) {
                    $data['dob'] = null;
                }
                
                $this->userModel->update(session()->get('id'), $data);
                session()->set(array_merge(session()->get(), $data));
            }
            
            return redirect()->to('/profile')->with('success', 'Profile updated successfully!');
        } catch (\Exception $e) {
            return redirect()->to('/profile')->with('error', 'Save Error: ' . $e->getMessage());
        }
    }
}