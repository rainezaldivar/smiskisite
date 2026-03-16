<?php namespace App\Controllers;

use App\Models\ProductModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class Shop extends Controller
{
    public function index()
    {
        $productModel = new ProductModel();
        
        $category = $this->request->getGet('category');
        $sort = $this->request->getGet('sort') ?? 'latest';

        if (!empty($category)) {
            if (is_array($category)) {
                $productModel->whereIn('category', $category);
            } else {
                $productModel->where('category', $category);
            }
        }

        switch ($sort) {
            case 'price_asc':
                $productModel->orderBy('price', 'ASC');
                break;
            case 'price_desc':
                $productModel->orderBy('price', 'DESC');
                break;
            case 'best_selling':
                $productModel->orderBy('id', 'DESC'); 
                break;
            case 'latest':
            default:
                $productModel->orderBy('id', 'DESC');
                break;
        }

        $data['products'] = $productModel->findAll();
        $data['currentCategory'] = $category;
        $data['currentSort'] = $sort;

        return view('shop', $data); 
    }

    public function viewProduct($id)
    {
        $productModel = new ProductModel();
        $data['product'] = $productModel->find($id);

        if (!$data['product']) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        // Fetch 5 random products for the "You May Also Like" section
        $data['randomProducts'] = $productModel->where('id !=', $id)
                                               ->orderBy('RAND()')
                                               ->findAll(5);

        return view('product_view', $data);
    }

    public function add()
    {
        $session = session();
        
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login')->with('error', 'Please log in to add items to your cart.');
        }

        $cart = $session->get('cart') ?? [];

        $id = $this->request->getPost('product_id');
        $name = $this->request->getPost('product_name');
        $price = $this->request->getPost('product_price');
        $image = $this->request->getPost('product_image');
        
        // FIXED: Properly get the selected quantity
        $qty = $this->request->getPost('qty') ? (int)$this->request->getPost('qty') : 1;

        if (empty($image)) {
            $image = 'default.png';
        }

        if (isset($cart[$id])) {
            $cart[$id]['qty'] += $qty; // Adds the correct quantity
        } else {
            $cart[$id] = [
                'id' => $id,
                'name' => $name,
                'price' => $price,
                'img' => $image, 
                'qty' => $qty
            ];
        }

        $session->set('cart', $cart);
        
        // FIXED: Explicitly redirect back to the specific product instead of relying on browser history
        return redirect()->to('/shop/product/' . $id)->with('success', 'Added to cart successfully!');
    }

    public function remove($id)
    {
        $session = session();
        $cart = $session->get('cart') ?? [];

        if (isset($cart[$id])) {
            unset($cart[$id]);
            $session->set('cart', $cart);
        }

        return redirect()->back();
    }

    public function cart()
    {
        $session = session();
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $data['cart'] = $session->get('cart') ?? [];
        return view('cart', $data);
    }

    public function checkout()
    {
        $session = session();
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $selectedItemIds = $this->request->getPost('selected_items');
        
        if (empty($selectedItemIds)) {
            return redirect()->to('/shop/cart')->with('error', 'Please select items to checkout.');
        }

        $sessionCart = $session->get('cart') ?? [];
        $checkoutCart = [];

        foreach ($selectedItemIds as $id) {
            if (isset($sessionCart[$id])) {
                $checkoutCart[$id] = $sessionCart[$id];
            }
        }

        if (empty($checkoutCart)) {
            return redirect()->to('/customer/shop')->with('error', 'Your cart is empty or selected items are invalid.');
        }

        $data['cart'] = $checkoutCart;

        $userModel = new UserModel();
        $data['user'] = $userModel->find($session->get('id'));

        return view('checkout', $data);
    }

    public function directCheckout()
    {
        $session = session();
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $id = $this->request->getPost('product_id');
        
        if (!$id) {
            return redirect()->to('/shop')->with('error', 'Invalid product.');
        }

        $image = $this->request->getPost('product_image');
        if (empty($image)) {
            $image = 'default.png';
        }

        // FIXED: Safely grab the quantity for Buy Now as well
        $qty = $this->request->getPost('qty') ? (int)$this->request->getPost('qty') : 1;

        $checkoutCart = [
            $id => [
                'id'    => $id,
                'name'  => $this->request->getPost('product_name'),
                'price' => $this->request->getPost('product_price'),
                'img'   => $image,
                'qty'   => $qty
            ]
        ];

        $data['cart'] = $checkoutCart;
        
        $userModel = new UserModel();
        $data['user'] = $userModel->find($session->get('id'));

        return view('checkout', $data);
    }

    public function placeOrder()
    {
        $session = session();
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        $session->remove('cart');
        return view('success');
    }
}