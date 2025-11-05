<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smiski Store</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

  <!-- Custom CSS -->
  <link rel="stylesheet" href="<?= base_url('css/style.css') ?>">

  <style>
    html {
      scroll-behavior: smooth;
    }

    body {
      padding-top: 80px;
    }

    .custom-navbar {
      background-color: #198754;
    }

    .navbar .nav-link.active {
      color: #ffc107 !important;
      font-weight: 600;
    }
  </style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top">
  <div class="container">

    <!-- LOGO -->
    <a class="navbar-brand d-flex align-items-center" href="<?= base_url('/customer/home') ?>">
      <img src="<?= base_url('uploads/top_logo.png') ?>" alt="Smiski Store Logo"
           style="height: 45px; width: auto; object-fit: contain; margin-right: 8px;">
    </a>

    <!-- TOGGLER -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- NAV LINKS -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#smiski-products">Products</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?= base_url('/customer/profile') ?>">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-danger" href="<?= base_url('/logout') ?>">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- BOOTSTRAP JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- ACTIVE LINK HIGHLIGHT -->
<script>
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
</script>
</body>
</html>
