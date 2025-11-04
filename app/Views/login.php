<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Login </title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= base_url('css/login.css') ?>">

</head>
<body class="login-body">

  <div class="auth-container">
    <h2> Smiski Shop </h2>
    <p class="subtitle">Welcome back! Please log in.</p>

    <?php if(session()->getFlashdata('error')): ?>
      <div class="alert alert-danger"><?= session()->getFlashdata('error') ?></div>
    <?php endif; ?>

    <form method="post" action="/loginAuth">
      <label class="form-label">Email</label>
      <input type="email" name="email" class="form-control" required>

      <label class="form-label">Password</label>
      <input type="password" name="password" class="form-control" required>

      <button type="submit" class="btn btn-auth">Login</button>
    </form>

    <p class="footer-text">
      No account? <a href="/register">Register here</a>
    </p>
  </div>


</body>
</html>
