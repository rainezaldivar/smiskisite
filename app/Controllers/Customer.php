<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Customer extends Controller
{
    // ==== CUSTOMER HOME PAGE (Public Access) ====
    public function index()
    {
        // 1. LOGIN CHECK REMOVED 
        // We allow guests to view the homepage now.

        // ==== LOAD PRODUCT MODEL ====
        $productModel = new ProductModel();

        // ==== FETCH ALL PRODUCTS FOR "BROWSE PRODUCTS" SECTION ====
        // We sort by 'id' DESC to show the latest products first
        $data['products'] = $productModel->orderBy('id', 'DESC')->findAll();

        // ==== LOAD CUSTOMER HOME VIEW ====
        return view('customer_home', $data);
    }

    // ==== CUSTOMER PROFILE PAGE (Protected) ====
    public function profile()
    {
        // ==== CHECK IF USER IS LOGGED IN ====
        // We Keep this here because profiles are private!
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); 
        }

        // ==== LOAD USER MODEL ====
        $userModel = new UserModel();
        $userId = session()->get('id'); // get current user ID

        // ==== FETCH CURRENT USER DATA ====
        $data['user'] = $userModel->find($userId);

        // ==== LOAD PROFILE VIEW ====
        return view('profile', $data);
    }

    // ==================================================
    // ==== NEW: CART PAGE FUNCTION (Added this!) ====
    // ==================================================
    public function cart()
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); 
        }

        return view('cart');
    }

    // ==================================================
    // ==== EXTRA: SHOP PAGE (Para gumana yung links) ====
    // ==================================================
    // Idinagdag ko na rin ito kasi yung Cart page natin may "Continue Shopping" link
    public function shop()
    {
        // Load data if needed, or just show the view
        return view('shop'); 
    }
    
    // ==== EXTRA: ABOUT PAGE ====
    public function about()
    {
        return view('about');
    }
}