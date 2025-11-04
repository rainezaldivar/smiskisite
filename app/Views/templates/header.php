<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smiski Store</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    html {
      scroll-behavior: smooth; /* enables smooth scrolling */
    }
  </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <!-- Logo redirects to home -->
    <a class="navbar-brand" href="<?= base_url('customer/home') ?>">Smiski Store</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <!-- Scrolls to the product section -->
        <li class="nav-item">
          <a class="nav-link" href="#all-products">Products</a>
        </li>

        <!-- Profile is a separate page -->
        <li class="nav-item">
          <a class="nav-link" href="<?= base_url('customer/profile') ?>">Profile</a>
        </li>

        <li class="nav-item">
          <a class="nav-link text-danger" href="<?= base_url('logout') ?>">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<div class="container mt-4">
