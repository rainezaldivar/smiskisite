<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>  REGISTER </title>

    <!-- BOOTSTRAP CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <!-- SHARED AUTH STYLES -->
    <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">
</head>

<body class="register-body">

    <!-- === REGISTER CONTAINER === -->
    <div class="auth-container">
        <!-- SITE TITLE -->
        <h2> SMISKI SHOP </h2>

        <!-- SUBTITLE -->
        <p class="subtitle">Create your account below to join the Smiski family!</p>

        <!-- VALIDATION ERRORS -->
        <?= isset($validation) ? '<div class="alert alert-danger text-start">'.$validation->listErrors().'</div>' : '' ?>

        <!-- REGISTER FORM -->
        <form method="post" action="/save">
            <!-- NAME FIELD -->
            <div class="mb-3 text-start">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>

            <!-- EMAIL FIELD -->
            <div class="mb-3 text-start">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>

            <!-- PASSWORD FIELD -->
            <div class="mb-3 text-start">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="submit" class="btn-auth">Register</button>
        </form>

        <!-- FOOTER TEXT -->
        <p class="footer-text">
            Already have an account?
            <a href="<?= base_url('login') ?>">Login here</a>
        </p>
    </div>
    <!-- END REGISTER CONTAINER -->

</body>
</html>
