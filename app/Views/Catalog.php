<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/catalog.css') ?>">

<?php
// ==========================================
// 1. BLIND BOX SERIES (Combined Event, Theme, Standard, Numbered)
// ==========================================
$blind_box_series = [
    // Theme & Events
    ['id' => 'birthday',   'name' => 'Birthday Series',   'img' => base_url('uploads/bday.png')],
    ['id' => 'sunday',     'name' => 'Sunday Series',     'img' => base_url('uploads/sun.png')],
    ['id' => 'moving',     'name' => 'Moving Series',     'img' => base_url('uploads/move.png')],
    ['id' => 'exercising', 'name' => 'Exercising Series', 'img' => base_url('uploads/workout.png')],
    ['id' => 'dressing',   'name' => 'Dressing Series',   'img' => base_url('uploads/dress.png')],
    ['id' => 'work',       'name' => 'Work Series',       'img' => base_url('uploads/work2.png')],
    ['id' => 'museum',     'name' => 'Museum Series',     'img' => base_url('uploads/museum2.png')],
    ['id' => 'cheer',      'name' => 'Cheer Series',      'img' => base_url('uploads/cheer2.png')],
    ['id' => 'living',     'name' => 'Living Series',     'img' => base_url('uploads/live.png')],
    ['id' => 'bed',        'name' => 'Bed Series',        'img' => base_url('uploads/bed2.png')],
    ['id' => 'yoga',       'name' => 'Yoga Series',       'img' => base_url('uploads/yoga2.png')],
    ['id' => 'bath',       'name' => 'Bath Series',       'img' => base_url('uploads/bath2.png')],
    ['id' => 'toilet',     'name' => 'Toilet Series',     'img' => base_url('uploads/toilet2.png')],
    ['id' => 'series4',    'name' => 'Series 4',          'img' => base_url('uploads/s4.png')],
    ['id' => 'series3',    'name' => 'Series 3',          'img' => base_url('uploads/s3.png')],
    ['id' => 'series2',    'name' => 'Series 2',          'img' => base_url('uploads/s2.png')],
    ['id' => 'series1',    'name' => 'Series 1',          'img' => base_url('uploads/s1.png')],

];

// ==========================================
// 2. ACCESSORIES (Straps, Hippers, Plush, etc.)
// ==========================================
$accessories = [
    ['id' => 'hippers',  'name' => 'Smiski Hippers',  'img' => base_url('uploads/hip.png')],
    ['id' => 'zipper',   'name' => 'Zipperbite Vol. 2',     'img' => base_url('uploads/zipbite2.png')],
    ['id' => 'zipper',   'name' => 'Zipperbites Vol. 1',     'img' => base_url('uploads/zipbite1.png')],
    ['id' => 'keychain', 'name' => 'Smiski Keychain', 'img' => base_url('uploads/kchain.png')],
    ['id' => 'strap1',   'name' => 'Strap Accessory Series 1',  'img' => base_url('uploads/strapacc1.png')],
    ['id' => 'strap2',   'name' => 'Strap Accessory Series 2',  'img' => base_url('uploads/strapacc2.png')],
    ['id' => 'strap3',   'name' => 'Strap Accessory Series 3',  'img' => base_url('uploads/strapacc3.png')],
    ['id' => 'cushion',  'name' => 'Cushion Pouch',      'img' => base_url('uploads/cush.png')],
    ['id' => 'sticker',  'name' => 'Embroidery Sticker Vol. 2', 'img' => base_url('uploads/embroidery2.png')],
    ['id' => 'sticker',  'name' => 'Embroidery Sticker Vol. 1', 'img' => base_url('uploads/embroidery1.png')],
    ['id' => 'plush',    'name' => 'Smiski Plush',       'img' => base_url('uploads/plushie.png')],
    ['id' => 'plushkey', 'name' => 'Plush Keychain',     'img' => base_url('uploads/plushchain.png')],
];

// ==========================================
// 3. LIFESTYLE & HOME
// ==========================================
$lifestyle = [
    ['id' => 'light',      'name' => 'Touch Light Vol. 1',      'img' => base_url('uploads/light1.png')],
    ['id' => 'light',      'name' => 'Touch Light Vol. 2',      'img' => base_url('uploads/light2.png')],
    ['id' => 'toothbrush', 'name' => 'Toothbrush Stand', 'img' => base_url('uploads/brushstand.png')],
    ['id' => 'bobbing',    'name' => 'Bobbing Head',     'img' => base_url('uploads/bobhead.png')],
    ['id' => 'sensor',     'name' => 'Sensor Light',     'img' => base_url('uploads/sense.png')],
    ['id' => 'bathball',   'name' => 'Bath Ball 2',        'img' => base_url('uploads/bb2.png')],
    ['id' => 'bathball',   'name' => 'Bath Ball 1',        'img' => base_url('uploads/bb1.png')],
];
?>

<div class="product-wrapper">
    <div class="container pb-5">

        <div class="text-center mb-5">
            <h2 class="section-title">Collector's Dictionary</h2>
            <p class="text-muted">Click on a series to see what's inside!</p>
        </div>

        <div class="mb-5">
            <div class="category-header mb-4">
                <i class="bi bi-box-seam fs-2 text-success"></i>
                <h3 class="fw-bold m-0 text-success">Figurines</h3>
            </div>
            
            <div class="row g-4">
                <?php foreach($blind_box_series as $item): ?>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <a href="<?= base_url('details?item=' . $item['id']) ?>" class="card h-100 text-decoration-none border-0 rounded-4 custom-hover-card">
                            <div class="card-body p-4 d-flex flex-column align-items-center">
                                <div class="img-bg-circle mb-3">
                                    <img src="<?= $item['img'] ?>" alt="<?= esc($item['name']) ?>">
                                </div>
                                <h4 class="fw-bold text-center text-success mb-1 fs-5"><?= esc($item['name']) ?></h4>
                            </div>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="mb-5">
            <div class="category-header mb-4">
                <i class="bi bi-bag-heart fs-2 text-success"></i>
                <h3 class="fw-bold m-0 text-success">Accessories</h3>
            </div>
            
            <div class="row g-4">
                <?php foreach($accessories as $item): ?>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <a href="<?= base_url('details?item=' . $item['id']) ?>" class="card h-100 text-decoration-none border-0 rounded-4 custom-hover-card">
                            <div class="card-body p-4 d-flex flex-column align-items-center">
                                <div class="img-bg-circle mb-3">
                                    <img src="<?= $item['img'] ?>" alt="<?= esc($item['name']) ?>">
                                </div>
                                <h4 class="fw-bold text-center text-success mb-1 fs-5"><?= esc($item['name']) ?></h4>
                            </div>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="mb-5">
            <div class="category-header mb-4">
                <i class="bi bi-lamp fs-2 text-success"></i>
                <h3 class="fw-bold m-0 text-success">Lifestyle & Home</h3>
            </div>
            
            <div class="row g-4">
                <?php foreach($lifestyle as $item): ?>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <a href="<?= base_url('details?item=' . $item['id']) ?>" class="card h-100 text-decoration-none border-0 rounded-4 custom-hover-card">
                            <div class="card-body p-4 d-flex flex-column align-items-center">
                                <div class="img-bg-circle mb-3">
                                    <img src="<?= $item['img'] ?>" alt="<?= esc($item['name']) ?>">
                                </div>
                                <h4 class="fw-bold text-center text-success mb-1 fs-5"><?= esc($item['name']) ?></h4>
                            </div>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

    </div>
</div>

<?= $this->include('templates/footer') ?>