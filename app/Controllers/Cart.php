<?php namespace App\Controllers;

use CodeIgniter\Controller;

class Cart extends Controller
{
    public function index()
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); 
        }

        // Kunin ang cart sa session para ma-ipasa sa view
        $cart = session()->get('cart') ?? [];
        
        $data = [
            'cart' => $cart
        ];

        return view('cart', $data);
    }

    // Function para sa Plus at Minus button
    public function update()
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); 
        }

        $rowid = $this->request->getPost('rowid');
        $action = $this->request->getPost('action');
        
        $cart = session()->get('cart') ?? [];

        // Check if item exists sa cart
        if (isset($cart[$rowid])) {
            if ($action == 'plus') {
                $cart[$rowid]['qty']++;
            } elseif ($action == 'minus') {
                $cart[$rowid]['qty']--;
                
                // Kung naging 0 na yung quantity, tanggalin na sa cart
                if ($cart[$rowid]['qty'] <= 0) {
                    unset($cart[$rowid]); 
                }
            }
            
            // I-save ulit yung updated cart sa session
            session()->set('cart', $cart);
        }

        // I-refresh ang page
        return redirect()->back(); 
    }

    // Function para sa Delete (Trash) button
    public function remove($id = null)
    {
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login'); 
        }

        if ($id !== null) {
            $cart = session()->get('cart') ?? [];
            
            // Kung nasa cart yung item, tanggalin (unset)
            if (isset($cart[$id])) {
                unset($cart[$id]);
                session()->set('cart', $cart);
            }
        }

        // I-refresh ang page
        return redirect()->back();
    }
}