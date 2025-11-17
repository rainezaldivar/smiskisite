<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LOGIN</title>

    <!-- ==== BOOTSTRAP CSS ==== -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <!-- ==== CUSTOM CSS ==== -->
    <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">
</head>

<body class="login-body">

    <!-- ==== LOGIN CONTAINER ==== -->
    <div class="auth-container">
        
        <!-- ==== SITE TITLE ==== -->
        <h2>SMISKI SHOP</h2>

        <!-- ==== SUBTITLE ==== -->
        <p class="subtitle">Welcome back! Please log in.</p>

        <!-- ==== ERROR MESSAGE ==== -->
        <?php if(session()->getFlashdata('error')): ?>
            <div class="alert alert-danger">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <!-- ==== LOGIN FORM ==== -->
        <form method="post" action="/loginAuth">
            
            <!-- ==== EMAIL FIELD ==== -->
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>

            <!-- ==== PASSWORD FIELD ==== -->
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>

            <!-- ==== SUBMIT BUTTON ==== -->
            <button type="submit" class="btn btn-auth">Login</button>
        </form>

        <!-- ==== FOOTER TEXT ==== -->
        <p class="footer-text">
            No account? <a href="/register">Register here</a>
        </p>
    </div>
