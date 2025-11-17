<?= $this->include('templates/header') ?>

<!-- ==== CUSTOM CSS ==== -->
<link rel="stylesheet" href="<?= base_url('css/product.css') ?>">

<?php
// ==== FIGURINES PRODUCTS ARRAY ====
$products_figurines = [
    ['img' => base_url('uploads/bday.png'), 'link' => 'https://smiski.com/e/products/birthday-series/'],
    ['img' => base_url('uploads/sun.png'), 'link' => 'https://smiski.com/e/products/sunday-series/'],
    ['img' => base_url('uploads/hip.png'), 'link' => 'https://smiski.com/e/products/hippers-series/'],
    ['img' => base_url('uploads/move.png'), 'link' => 'https://smiski.com/e/products/moving-series/'],
    ['img' => base_url('uploads/workout.png'), 'link' => 'https://smiski.com/e/products/exercising-series/'],
    ['img' => base_url('uploads/dress.png'), 'link' => 'https://smiski.com/e/products/dressing-series/'],
    ['img' => base_url('uploads/work2.png'), 'link' => 'https://smiski.com/e/products/work-series/'],
    ['img' => base_url('uploads/museum2.png'), 'link' => 'https://smiski.com/e/products/museumseries/'],
    ['img' => base_url('uploads/cheer2.png'), 'link' => 'https://smiski.com/e/products/cheerseries/'],
    ['img' => base_url('uploads/yoga2.png'), 'link' => 'https://smiski.com/e/products/yoga-series/'],
    ['img' => base_url('uploads/bed2.png'), 'link' => 'https://smiski.com/e/products/bed-series/'],
    ['img' => base_url('uploads/live.png'), 'link' => 'https://smiski.com/e/products/living/'],
    ['img' => base_url('uploads/bath2.png'), 'link' => 'https://smiski.com/e/products/bath-series/'],
    ['img' => base_url('uploads/toilet2.png'), 'link' => 'https://smiski.com/e/products/toilet-series/'],
    ['img' => base_url('uploads/s4.png'), 'link' => 'https://smiski.com/e/products/series-4/'],
    ['img' => base_url('uploads/s3.png'), 'link' => 'https://smiski.com/e/products/series-3/'],
    ['img' => base_url('uploads/s2.png'), 'link' => 'https://smiski.com/e/products/series-2/'],
    ['img' => base_url('uploads/s1.png'), 'link' => 'https://smiski.com/e/products/series-1/'],
];

// ==== OTHER PRODUCTS ARRAY ====
$products_other = [
    ['img' => base_url('uploads/light2.png'), 'link' => 'https://smiski.com/e/products/touch-light-vol2/'],
    ['img' => base_url('uploads/plushie.png'), 'link' => 'https://smiski.com/e/products/plush/'],
    ['img' => base_url('uploads/strapacc2.png'), 'link' => 'https://smiski.com/e/products/strap-accessories-series2/'],
    ['img' => base_url('uploads/cush.png'), 'link' => 'NULL'],
    ['img' => base_url('uploads/embroidery2.png'), 'link' => 'https://smiski.com/e/products/embroidery-sticker-series-vol2/'],
    ['img' => base_url('uploads/plushchain.png'), 'link' => 'https://smiski.com/e/products/plush-key-chain/'],
    ['img' => base_url('uploads/zipbite2.png'), 'link' => 'https://smiski.com/e/products/zipperbite-smiski-vol2/'],
    ['img' => base_url('uploads/embroidery1.png'), 'link' => 'https://smiski.com/e/products/embroidery-sticker-series/'],
    ['img' => base_url('uploads/strapacc1.png'), 'link' => 'https://smiski.com/e/products/accessories/'],
    ['img' => base_url('uploads/light1.png'), 'link' => 'https://smiski.com/e/products/touch-light/'],
    ['img' => base_url('uploads/zipbite1.png'), 'link' => 'https://smiski.com/e/products/zipperbite-smiski/'],
    ['img' => base_url('uploads/rainbomb.png'), 'link' => 'https://smiski.com/e/products/rainbomb/'],
    ['img' => base_url('uploads/bobhead.png'), 'link' => 'https://smiski.com/e/products/bobbing-head/'],
    ['img' => base_url('uploads/bb2.png'), 'link' => 'https://smiski.com/e/products/bathball2/'],
    ['img' => base_url('uploads/bb1.png'), 'link' => 'https://smiski.com/e/products/bath-ball/'],
    ['img' => base_url('uploads/kchain.png'), 'link' => 'https://smiski.com/e/products/key-chain/'],
    ['img' => base_url('uploads/brushstand.png'), 'link' => 'https://smiski.com/e/products/toothbrush-stand/'],
    ['img' => base_url('uploads/sense.png'), 'link' => 'https://smiski.com/e/products/sensor-light/'],
];
?>

<!-- ==== FIGURINES SECTION ==== -->
<h2>Figurines</h2>
<div class="grid">
  <?php foreach($products_figurines as $prod): ?>
    <a href="<?= $prod['link'] ?>" target="_blank" rel="noopener noreferrer">
      <img src="<?= $prod['img'] ?>" alt="Product" />
    </a>
  <?php endforeach; ?>
</div>

<!-- ==== OTHER PRODUCTS SECTION ==== -->
<h2>Other Products</h2>
<div class="grid">
  <?php foreach($products_other as $prod): ?>
    <a href="<?= $prod['link'] ?>" target="_blank" rel="noopener noreferrer">
      <img src="<?= $prod['img'] ?>" alt="Product" />
    </a>
  <?php endforeach; ?>
</div>

<?= $this->include('templates/footer') ?>
