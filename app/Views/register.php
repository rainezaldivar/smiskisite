<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> Register </title>

  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

  <!-- Shared Auth Styles -->
  <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">
</head>

<body class="register-body">

  <div class="auth-container">
    <h2> Smiski Shop </h2>
    <p class="subtitle">Create your account below to join the Smiski family!</p>

    <!-- Validation Errors -->
    <?= isset($validation) ? '<div class="alert alert-danger text-start">'.$validation->listErrors().'</div>' : '' ?>

    <form method="post" action="/save">
      <div class="mb-3 text-start">
        <label class="form-label">Name</label>
        <input type="text" name="name" class="form-control" required>
      </div>

      <div class="mb-3 text-start">
        <label class="form-label">Email</label>
        <input type="email" name="email" class="form-control" required>
      </div>

      <div class="mb-3 text-start">
        <label class="form-label">Password</label>
        <input type="password" name="password" class="form-control" required>
      </div>

      <button type="submit" class="btn-auth">Register</button>
    </form>

    <p class="footer-text">
      Already have an account?
      <a href="<?= base_url('login') ?>">Login here</a>
    </p>
  </div>


</body>
</html>
