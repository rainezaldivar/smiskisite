<?= $this->include('templates/header') ?>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-lg border-0">
        <div class="card-body text-center">
          <img src="<?= base_url('uploads/profile_default.png') ?>" 
               alt="Profile Picture" 
               class="rounded-circle mb-3" 
               style="width: 120px; height: 120px; object-fit: cover;">
          <h4 class="fw-bold mb-0 text-dark"><?= esc($user['name'] ?? 'Customer Name') ?></h4>
          <p class="text-muted mb-3"><?= esc($user['email'] ?? 'email@example.com') ?></p>
          <hr>
          <p class="mb-2"><strong>Address:</strong> <?= esc($user['address'] ?? 'Not set') ?></p>
          <p class="mb-2"><strong>Phone:</strong> <?= esc($user['phone'] ?? 'Not set') ?></p>
          <p class="mb-2"><strong>Member Since:</strong> <?= esc($user['created_at'] ?? '2025') ?></p>
          <div class="mt-4">
            <a href="<?= base_url('customer/home') ?>" class="btn btn-outline-secondary">← Back to Store</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?= $this->include('templates/footer') ?>
