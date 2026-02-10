<?= $this->include('templates/header') ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Smiski Shop</title>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    
    <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">
</head>
<body class="login-body">

    <div class="auth-container">
        
        <div class="mb-4 text-center">
            <h2>Log In</h2>
            <p class="text-muted">Welcome back! Please enter your details.</p>
        </div>

        <?php if(session()->getFlashdata('error')): ?>
            <div class="alert alert-danger shadow-sm">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <form method="post" action="/loginAuth">
            
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="name@example.com" required>
            </div>

            <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn btn-auth">Log In</button>
        </form>

        <div class="mt-4 text-center">
            <p class="small text-muted">
                Don't have an account? 
                <a href="<?= base_url('register') ?>" class="register-link">Sign up</a>
            </p>
        </div>

    </div>

</body>
</html>