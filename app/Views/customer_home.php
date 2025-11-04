<?= $this->include('templates/header') ?>

<!-- === MANUAL CAROUSEL === -->
<h3 class="mb-3">Newly Released Smiski Products</h3>

<div id="manualCarousel" class="carousel slide mb-5" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="<?= base_url('uploads/smiski1.png') ?>" class="d-block w-100" style="max-height:400px; object-fit:contain;" alt="Smiski 1">
    </div>
    <div class="carousel-item">
      <img src="<?= base_url('uploads/smiski2.png') ?>" class="d-block w-100" style="max-height:400px; object-fit:contain;" alt="Smiski 2">
    </div>
    <div class="carousel-item">
      <img src="<?= base_url('uploads/smiski3.jpg') ?>" class="d-block w-100" style="max-height:400px; object-fit:contain;" alt="Smiski 3">
    </div>
        <div class="carousel-item">
      <img src="<?= base_url('uploads/smiski4.webp') ?>" class="d-block w-100" style="max-height:400px; object-fit:contain;" alt="Smiski 3">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#manualCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#manualCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>
</div>

<!-- === SMISKI FIGURINES SECTION === -->
<h3 class="mb-4">SMISKI Figurines</h3>
<div class="row">
  <?php if (!empty($products)): ?>
    <?php foreach ($products as $item): ?>
      <div class="col-md-3 mb-4">
        <div class="card product-card h-100 shadow-sm position-relative border-0">
          <a href="<?= base_url('customer/view/' . $item['id']) ?>" class="text-decoration-none text-dark">
            <img src="<?= base_url('uploads/' . esc($item['image'])) ?>" 
                 class="card-img-top" 
                 alt="<?= esc($item['name']) ?>" 
                 style="object-fit: contain; height: 220px;">
            <div class="card-body text-center">
              <h6 class="fw-bold"><?= esc($item['name']) ?></h6>
              <p class="mb-1 fw-semibold text-success">
                ₱<?= number_format($item['price'], 2) ?>
              </p>
              <?php if (!empty($item['stock']) && $item['stock'] > 0): ?>
                <small class="text-muted">In Stock: <?= esc($item['stock']) ?></small>
              <?php else: ?>
                <small class="text-danger fw-bold">Out of Stock</small>
              <?php endif; ?>
            </div>
          </a>
          <!-- Heart icon -->
          <button class="btn btn-light position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm favorite-btn" data-id="<?= $item['id'] ?>">
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    <?php endforeach; ?>
  <?php else: ?>
    <p class="text-muted">No Smiski products available.</p>
  <?php endif; ?>
</div>

<!-- === OTHER PRODUCTS SECTION === -->
<h3 class="mb-4 mt-5">Other Products</h3>
<div class="row">
  <?php if (!empty($others)): ?>
    <?php foreach ($others as $item): ?>
      <div class="col-md-3 mb-4">
        <div class="card product-card h-100 shadow-sm position-relative border-0">
          <a href="<?= base_url('customer/view/' . $item['id']) ?>" class="text-decoration-none text-dark">
            <img src="<?= base_url('uploads/' . esc($item['image'])) ?>" 
                 class="card-img-top" 
                 alt="<?= esc($item['name']) ?>" 
                 style="object-fit: contain; height: 220px;">
            <div class="card-body text-center">
              <h6 class="fw-bold"><?= esc($item['name']) ?></h6>
              <p class="mb-1 fw-semibold text-success">
                ₱<?= number_format($item['price'], 2) ?>
              </p>
              <?php if (!empty($item['stock']) && $item['stock'] > 0): ?>
                <small class="text-muted">In Stock: <?= esc($item['stock']) ?></small>
              <?php else: ?>
                <small class="text-danger fw-bold">Out of Stock</small>
              <?php endif; ?>
            </div>
          </a>
          <!-- Heart icon -->
          <button class="btn btn-light position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm favorite-btn" data-id="<?= $item['id'] ?>">
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    <?php endforeach; ?>
  <?php else: ?>
    <p class="text-muted">No other products available.</p>
  <?php endif; ?>
</div>

<hr>

<?= $this->include('templates/footer') ?>

<!-- === Bootstrap Icons === -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

<!-- === JS for Heart Button === -->
<script>
document.querySelectorAll('.favorite-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.classList.toggle('text-danger');
    btn.querySelector('i').classList.toggle('bi-heart');
    btn.querySelector('i').classList.toggle('bi-heart-fill');
  });
});
</script>
