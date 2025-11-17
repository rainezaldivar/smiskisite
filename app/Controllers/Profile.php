<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Profile extends Controller
{
    protected $userModel;

    public function __construct()
    {
        // ==== LOAD FORM AND URL HELPERS ====
        helper(['form', 'url']);

        // ==== INITIALIZE USER MODEL ====
        $this->userModel = new UserModel();
    }

    // ==== PROFILE PAGE ====
    public function index()
    {
        // ==== CHECK IF USER IS LOGGED IN ====
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); // redirect if not logged in
        }

        // ==== GET CURRENT USER DATA ====
        $userId = session()->get('id');
        $user = $this->userModel->find($userId);

        // ==== LOAD PROFILE VIEW WITH USER DATA ====
        return view('profile', ['user' => $user]);
    }

    // ==== UPLOAD PROFILE PICTURE ====
    public function uploadProfilePicture()
    {
        // ==== CHECK IF USER IS LOGGED IN ====
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        // ==== GET UPLOADED FILE ====
        $file = $this->request->getFile('profile_picture');

        // ==== CHECK IF FILE IS VALID ====
        if (!$file->isValid() || $file->getError() !== UPLOAD_ERR_OK) {
            return redirect()->back()->with('error', 'Invalid or corrupted file.');
        }

        // ==== CHECK FILE TYPE ====
        $allowedTypes = ['jpg', 'jpeg', 'png'];
        $ext = strtolower($file->getExtension());
        if (!in_array($ext, $allowedTypes)) {
            return redirect()->back()->with('error', 'Only JPG or PNG allowed.');
        }

        // ==== CHECK FILE SIZE (MAX 2MB) ====
        if ($file->getSize() > 2 * 1024 * 1024) {
            return redirect()->back()->with('error', 'File too large (max 2MB).');
        }

        // ==== CREATE UPLOAD DIRECTORY IF NOT EXISTS ====
        $uploadsDir = WRITEPATH . 'uploads/';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }

        // ==== CREATE NEW FILENAME AND MOVE FILE ====
        $newFileName = 'profile_' . session()->get('id') . '_' . time() . '.' . $ext;
        $file->move($uploadsDir, $newFileName);

        // ==== IMAGE MANIPULATION (RESIZE TO 300x300) ====
        \Config\Services::image()
            ->withFile($uploadsDir . $newFileName)
            ->fit(300, 300, 'center')
            ->save($uploadsDir . $newFileName);

        // ==== UPDATE DATABASE WITH NEW PROFILE PICTURE ====
        $this->userModel->update(session()->get('id'), [
            'profile_picture' => $newFileName
        ]);

        return redirect()->to('/profile')->with('success', 'Profile photo updated!');
    }

    // ==== DISPLAY PROFILE PICTURE ====
    public function profilePicture($filename)
    {
        $path = WRITEPATH . 'uploads/' . $filename;

        // ==== CHECK IF FILE EXISTS ====
        if (!file_exists($path)) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException();
        }

        // ==== RETURN IMAGE CONTENT ====
        return $this->response
                    ->setContentType(mime_content_type($path))
                    ->setBody(file_get_contents($path));
    }
}
