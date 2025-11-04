<!DOCTYPE html>
<html>
<head>
  <title>Register | Smiski Shop</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
<div class="container mt-5">
  <h3 class="text-center mb-4">Create Account</h3>
  <?= isset($validation) ? '<div class="alert alert-danger">'.$validation->listErrors().'</div>' : '' ?>
  <form method="post" action="/save">
    <div class="mb-3">
      <label>Full Name</label>
      <input type="text" name="name" class="form-control" required>
    </div>
    <div class="mb-3">
      <label>Email</label>
      <input type="email" name="email" class="form-control" required>
    </div>
    <div class="mb-3">
      <label>Password</label>
      <input type="password" name="password" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-success w-100">Register</button>
  </form>
  <p class="mt-3 text-center">Already registered? <a href="/login">Login here</a></p>
</div>
</body>
</html>
