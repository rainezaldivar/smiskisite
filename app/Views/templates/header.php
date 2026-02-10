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
<body style="padding-top: 80px; display: flex; flex-direction: column; min-height: 100vh;">

<nav class="navbar navbar-expand-lg custom-navbar fixed-top">
    <div class="container">
        <a class="navbar-brand" href="<?= base_url('/') ?>">
            <img src="<?= base_url('uploads/top_logo.png') ?>" alt="Smiski" height="40">
        </a>

        <button class="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i class="bi bi-list fs-1" style="color: #40583c;"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center">
                
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/shop' ? 'active' : '' ?>" href="<?= base_url('customer/shop') ?>">All Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/product' ? 'active' : '' ?>" href="<?= base_url('customer/product') ?>">Catalog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'customer/about' ? 'active' : '' ?>" href="<?= base_url('customer/about') ?>">About</a>
                </li>

                <li class="nav-item ms-lg-2">
                    <a class="nav-link position-relative <?= uri_string() == 'cart' ? 'active' : '' ?>" href="<?= base_url('cart') ?>" title="Cart">
                        <i class="bi bi-cart3 fs-5"></i>
                        <span id="navbar-cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem; display: none;">
                            0
                        </span>
                    </a>
                </li>

                <li class="nav-item ms-lg-1">
                    <a class="nav-link <?= uri_string() == 'profile' ? 'active' : '' ?>" href="<?= base_url('profile') ?>" title="Profile">
                        <i class="bi bi-person-circle fs-5"></i>
                    </a>
                </li>

            </ul>
        </div>
    </div>
</nav>