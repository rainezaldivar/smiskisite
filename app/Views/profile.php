<?= $this->include('templates/header') ?>
<link rel="stylesheet" href="<?= base_url('css/style.css') ?>">

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-lg border-0">
        <div class="card-body text-center">

          <?php 
            $profileImg = (session()->get('role') === 'admin') ? 'adprofile.png' : 'profile.png';
          ?>
          <img src="<?= base_url('uploads/' . $profileImg) ?>" 
               alt="Profile Picture" 
               class="rounded-circle mb-3" 
               style="width: 120px; height: 120px; object-fit: cover;">

          <h4 class="fw-bold mb-0 text-dark"><?= esc($user['name'] ?? 'Customer Name') ?></h4>
          <p class="text-muted mb-3"><?= esc($user['email'] ?? 'email@example.com') ?></p>
          <hr>
          <p class="mb-2"><strong>Member Since:</strong> <?= esc($user['created_at'] ?? '2025') ?></p>

          <div class="mt-4">
            <?php if(session()->get('role') !== 'admin'): ?>
              <a href="<?= base_url('store') ?>" class="btn btn-secondary">Back to Store</a>
            <?php endif; ?>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>  

<?= $this->include('templates/footer') ?>
