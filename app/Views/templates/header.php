<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Smiski Shop</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
    <link href="<?= base_url('css/header.css') ?>" rel="stylesheet" />
</head>
<body>

<?php
    $session = session();
    $cart = $session->get('cart') ?? [];
    $cartCount = 0;
    
    if ($session->get('isLoggedIn')) {
        foreach($cart as $item) {
            $cartCount += $item['qty'];
        }
    }

    $isCheckout = strpos(uri_string(), 'checkout') !== false || strpos(uri_string(), 'cart') !== false;
?>

<nav class="navbar navbar-expand-lg custom-navbar fixed-top">
    <div class="container">
        <a class="navbar-brand" href="<?= base_url('/') ?>">
            <img src="<?= base_url('uploads/top_logo.png') ?>" alt="Smiski">
        </a>

        <?php if (!$isCheckout): ?>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/shop' ? 'active' : '' ?>" href="<?= base_url('customer/shop') ?>">Shop</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/catalog' ? 'active' : '' ?>" href="<?= base_url('customer/catalog') ?>">Catalog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/about' ? 'active' : '' ?>" href="<?= base_url('customer/about') ?>">About</a>
                </li>
            </ul>

            <ul class="navbar-nav align-items-center mb-2 mb-lg-0">
                <li class="nav-item me-3">
                    <a class="nav-link position-relative px-2" href="<?= base_url('customer/cart') ?>">
                        <i class="bi bi-cart2"></i>
                        <?php if($session->get('isLoggedIn') && $cartCount > 0): ?>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill smiski-badge" style="font-size: 0.65rem;">
                                <?= $cartCount ?>
                            </span>
                        <?php endif; ?>
                    </a>
                </li>

                <?php if($session->get('isLoggedIn')): ?>
                    <li class="nav-item">
                        <a class="nav-link px-2" href="<?= base_url('profile') ?>">
                            <i class="bi bi-person"></i>
                        </a>
                    </li>
                <?php else: ?>
                    <li class="nav-item ms-lg-2">
                        <a class="nav-link rounded-pill px-4 py-2 text-white" style="background-color: #2D7A1F; font-weight: 600;" href="<?= base_url('login') ?>">Login</a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
        <?php endif; ?>
    </div>
</nav>

</body>
</html>