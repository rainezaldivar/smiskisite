<?= $this->include('templates/header') ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Smiski Shop</title>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    
    <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">
</head>
<body class="register-body d-flex justify-content-center align-items-center vh-100">

    <div class="auth-container">
        
        <div class="text-center mb-4">
            <h2>Register</h2>
            <p class="text-muted">Join the family! Create your account below.</p>
        </div>

        <?= isset($validation) ? '<div class="alert alert-danger shadow-sm text-start">'.$validation->listErrors().'</div>' : '' ?>

        <form method="post" action="/save">
            <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" class="form-control" placeholder="e.g. Juan dela Cruz" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="name@example.com" required>
            </div>

            <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="Create a strong password" required>
            </div>

            <button type="submit" class="btn btn-auth mb-3">Create Account</button>        </form>

        <div class="text-center mt-4">
            <p class="small text-muted">Already a member? 
                <a href="<?= base_url('login') ?>" class="register-link">Log in here</a>
            </p>
        </div>
    </div>

</body>
</html>