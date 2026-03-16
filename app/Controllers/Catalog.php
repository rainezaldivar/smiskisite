<?php namespace App\Controllers;

class Catalog extends BaseController
{
    // 1. MAIN PAGE (The Dictionary List)
    public function index()
    {
        return view('catalog'); 
    }

    // 2. DETAILS PAGE (The Specific Series Info)
    public function details()
    {
        // Kunin ang ID mula sa URL (e.g., ?item=living)
        $itemId = $this->request->getVar('item'); 

        // Define ALL Products Data (Database Simulation)
        $all_products = [
            'living' => [
                'name' => 'Living Series',
                'katakana' => 'リビング シリーズ',
                'desc' => 'Smiskis that hide in plain sight in your living room.',
                'img'  => base_url('uploads/living.png'),
                'variations' => [
                    ['name' => 'Daydreaming', 'desc' => 'Lost in thought.'],
                    ['name' => 'Reading', 'desc' => 'Loves good books.'],
                    ['name' => 'Napping', 'desc' => 'Sleeping peacefully.'],
                    ['name' => 'Playing', 'desc' => 'Hide and seek pro.'],
                    ['name' => 'Hiding', 'desc' => 'Peeking behind things.'],
                    ['name' => 'Thinking', 'desc' => 'Solving problems.']
                ]
            ],
            'bed' => [
                'name' => 'Bed Series',
                'katakana' => 'ベッド シリーズ',
                'desc' => 'They glow beside you while you sleep.',
                'img'  => base_url('uploads/bed.png'),
                'variations' => [
                    ['name' => 'Sleepy', 'desc' => 'Rubbing eyes.'],
                    ['name' => 'Crying', 'desc' => 'Needs a hug.'],
                    ['name' => 'Storytelling', 'desc' => 'Reading bedtime stories.'],
                    ['name' => 'Pillow', 'desc' => 'Hugging a pillow.'],
                    ['name' => 'Blanket', 'desc' => 'Cozy and warm.'],
                    ['name' => 'Nightcap', 'desc' => 'Ready for dreams.']
                ]
            ],
            'yoga' => [
                'name' => 'Yoga Series',
                'katakana' => 'ヨガ シリーズ',
                'desc' => 'Finding inner peace in the dark.',
                'img'  => base_url('uploads/yoga.png'),
                'variations' => [
                    ['name' => 'Lotus', 'desc' => 'Meditation pose.'],
                    ['name' => 'Tree Pose', 'desc' => 'Balancing act.'],
                    ['name' => 'Bridge', 'desc' => 'Back flexibility.'],
                    ['name' => 'Warrior', 'desc' => 'Strong stance.'],
                    ['name' => 'Cobra', 'desc' => 'Stretching spine.'],
                    ['name' => 'Plank', 'desc' => 'Core strength.']
                ]
            ],
            'zipper' => [
                'name' => 'Zipperbites',
                'katakana' => 'ジッパーバイト',
                'desc' => 'Little glowy guys hanging on your zippers.',
                'img'  => base_url('uploads/zipperbite.png'),
                'variations' => [
                    ['name' => 'Hanging', 'desc' => 'Just hanging around.'],
                    ['name' => 'Climbing', 'desc' => 'Going up!'],
                    ['name' => 'Peeking', 'desc' => 'What’s inside?'],
                    ['name' => 'Pulling', 'desc' => 'Helping you zip.'],
                    ['name' => 'Dangling', 'desc' => 'Swing swing.'],
                    ['name' => 'Lazy', 'desc' => 'Not helping at all.']
                ]
            ],
            'keychain' => [
                'name' => 'Smiski Keychain',
                'katakana' => 'キーチェーン',
                'desc' => 'Take your Smiski everywhere you go.',
                'img'  => base_url('uploads/kchain.png'), 
                'variations' => []
            ],
            'light' => [
                'name' => 'Touch Light',
                'katakana' => 'タッチライト',
                'desc' => 'A gentle glow with just a tap.',
                'img'  => base_url('uploads/touch-light.png'),
                'variations' => [] 
            ],
            'toothbrush' => [
                'name' => 'Toothbrush Stand',
                'katakana' => '歯ブラシスタンド',
                'desc' => 'Protecting your toothbrush efficiently.',
                'img'  => base_url('uploads/brushstand.png'),
                'variations' => []
            ],
            'bobbing' => [
                'name' => 'Bobbing Head',
                'katakana' => 'ボビングヘッド',
                'desc' => 'A nodding companion for your desk.',
                'img'  => base_url('uploads/bobhead.png'),
                'variations' => []
            ]
        ];

        // Check kung valid ang item ID
        $selected_item = $all_products[$itemId] ?? null;

        // Fallback: Kapag mali ang ID, default to 'living'
        if (!$selected_item) {
            $selected_item = $all_products['living']; 
        }

        // Ipasa ang data sa View
        $data['current_item'] = $selected_item;
        
        return view('details', $data); // LOADS THE DETAILS VIEW
    }
}