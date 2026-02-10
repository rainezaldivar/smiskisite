<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/product.css') ?>">

<?php
// ==== FIGURINES PRODUCTS ARRAY (Added Names for Clarity) ====
$products_figurines = [
    ['name' => 'Birthday Series', 'img' => base_url('uploads/bday.png'), 'link' => 'https://smiski.com/e/products/birthday-series/'],
    ['name' => 'Sunday Series', 'img' => base_url('uploads/sun.png'), 'link' => 'https://smiski.com/e/products/sunday-series/'],
    ['name' => 'Hippers Series', 'img' => base_url('uploads/hip.png'), 'link' => 'https://smiski.com/e/products/hippers-series/'],
    ['name' => 'Moving Series', 'img' => base_url('uploads/move.png'), 'link' => 'https://smiski.com/e/products/moving-series/'],
    ['name' => 'Exercising Series', 'img' => base_url('uploads/workout.png'), 'link' => 'https://smiski.com/e/products/exercising-series/'],
    ['name' => 'Dressing Series', 'img' => base_url('uploads/dress.png'), 'link' => 'https://smiski.com/e/products/dressing-series/'],
    ['name' => 'Work Series', 'img' => base_url('uploads/work2.png'), 'link' => 'https://smiski.com/e/products/work-series/'],
    ['name' => 'Museum Series', 'img' => base_url('uploads/museum2.png'), 'link' => 'https://smiski.com/e/products/museumseries/'],
    ['name' => 'Cheer Series', 'img' => base_url('uploads/cheer2.png'), 'link' => 'https://smiski.com/e/products/cheer-series/'],
    ['name' => 'Yoga Series', 'img' => base_url('uploads/yoga.png'), 'link' => 'https://smiski.com/e/products/yoga-series/'],
    ['name' => 'Bed Series', 'img' => base_url('uploads/bed.png'), 'link' => 'https://smiski.com/e/products/bed-series/'],
    ['name' => 'Living Series', 'img' => base_url('uploads/living.png'), 'link' => 'https://smiski.com/e/products/living-series/'],
    ['name' => 'Toilet Series', 'img' => base_url('uploads/toilet.png'), 'link' => 'https://smiski.com/e/products/toilet-series/'],
    ['name' => 'Bath Series', 'img' => base_url('uploads/bath.png'), 'link' => 'https://smiski.com/e/products/bath-series/'],
    ['name' => 'Series 1', 'img' => base_url('uploads/series1.png'), 'link' => 'https://smiski.com/e/products/series1/'],
];

// ==== OTHER PRODUCTS ARRAY (Added Names) ====
$products_others = [
    ['name' => 'Touch Light', 'img' => base_url('uploads/touch-light/'), 'link' => 'https://smiski.com/e/products/touch-light/'],
    ['name' => 'Zipperbite', 'img' => base_url('uploads/zipbite1.png'), 'link' => 'https://smiski.com/e/products/zipperbite-smiski/'],
    ['name' => 'Rainbomb', 'img' => base_url('uploads/rainbomb.png'), 'link' => 'https://smiski.com/e/products/rainbomb/'],
    ['name' => 'Bobbing Head', 'img' => base_url('uploads/bobhead.png'), 'link' => 'https://smiski.com/e/products/bobbing-head/'],
    ['name' => 'Bath Ball 2', 'img' => base_url('uploads/bb2.png'), 'link' => 'https://smiski.com/e/products/bathball2/'],
    ['name' => 'Bath Ball 1', 'img' => base_url('uploads/bb1.png'), 'link' => 'https://smiski.com/e/products/bath-ball/'],
    ['name' => 'Key Chain', 'img' => base_url('uploads/kchain.png'), 'link' => 'https://smiski.com/e/products/key-chain/'],
    ['name' => 'Toothbrush Stand', 'img' => base_url('uploads/brushstand.png'), 'link' => 'https://smiski.com/e/products/toothbrush-stand/'],
    ['name' => 'Sensor Light', 'img' => base_url('uploads/sense.png'), 'link' => 'https://smiski.com/e/products/sensor-light/'],
];
?>

<div class="product-wrapper">
    <h2 class="section-title">Figurines</h2>
    <div class="product-grid">
      <?php foreach($products_figurines as $prod): ?>
        <a href="<?= $prod['link'] ?>" class="product-card" target="_blank" rel="noopener noreferrer">
            <div class="card-img-container">
                <img src="<?= $prod['img'] ?>" alt="<?= esc($prod['name']) ?>">
            </div>
            <div class="card-details">
                <h4 class="product-name"><?= esc($prod['name']) ?></h4>
                <span class="btn-view">View Series <i class="bi bi-arrow-right"></i></span>
            </div>
        </a>
      <?php endforeach; ?>
    </div>

    <h2 class="section-title">Other Products</h2>
    <div class="product-grid">
      <?php foreach($products_others as $prod): ?>
        <a href="<?= $prod['link'] ?>" class="product-card" target="_blank" rel="noopener noreferrer">
            <div class="card-img-container">
                <img src="<?= $prod['img'] ?>" alt="<?= esc($prod['name']) ?>">
            </div>
            <div class="card-details">
                <h4 class="product-name"><?= esc($prod['name']) ?></h4>
                <span class="btn-view">View Details <i class="bi bi-arrow-right"></i></span>
            </div>
        </a>
      <?php endforeach; ?>
    </div>
</div>

<?= $this->include('templates/footer') ?>