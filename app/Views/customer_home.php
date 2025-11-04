<?= $this->include('templates/header') ?>

<!-- === HERO CAROUSEL === -->
<div id="manualCarousel" class="carousel slide mb-5" data-bs-ride="carousel">
  <div class="carousel-inner rounded-4 shadow-sm overflow-hidden">
    <div class="carousel-item active">
      <a href="https://smiski.com/e/products/strap-accessories-series2/" target="_blank">
        <img src="<?= base_url('uploads/smiski1.png') ?>" class="d-block w-100" alt="Smiski 1" style="object-fit:contain;">
      </a>
    </div>
    <div class="carousel-item">
      <a href="https://smiski.com/e/products/embroidery-sticker-series-vol2/" target="_blank">
        <img src="<?= base_url('uploads/smiski2.png') ?>" class="d-block w-100" alt="Smiski 2" style="object-fit:contain;">
      </a>
    </div>
    <div class="carousel-item">
      <a href="https://smiski.com/e/products/plush-key-chain/" target="_blank">
        <img src="<?= base_url('uploads/smiski3.jpg') ?>" class="d-block w-100" alt="Smiski 3" style="object-fit:contain;">
      </a>
    </div>
    <div class="carousel-item">
      <a href="https://www.facebook.com/share/p/1C3NPs7cxz/" target="_blank">
        <img src="<?= base_url('uploads/smiski4.webp') ?>" class="d-block w-100" alt="Smiski 4" style="object-fit:contain;">
      </a>
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
<section id="smiski-products" class="py-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="fw-bold mb-0 text-primary">Smiski Figurines</h3>
    <a href="#others" class="view-more-link text-decoration-none fw-semibold">View Other Products →</a>
  </div>

  <div class="row g-4">
    <?php if (!empty($products)): ?>
      <?php foreach ($products as $item): ?>
        <div class="col-md-3 col-sm-6">
          <div class="product-card h-100 border-0 shadow-sm"
               data-bs-toggle="modal"
               data-bs-target="#productModal"
               data-name="<?= esc($item['name']) ?>"
               data-price="<?= number_format($item['price'], 2) ?>"
               data-stock="<?= $item['stock'] > 0 ? 'In Stock: '.$item['stock'] : 'Out of Stock' ?>"
               data-image="<?= base_url('uploads/' . esc($item['image'])) ?>"
               data-description="<?= esc($item['description'] ?? 'No description available') ?>">
            <div class="product-img-wrapper">
              <img src="<?= base_url('uploads/' . esc($item['image'])) ?>" 
                   alt="<?= esc($item['name']) ?>" class="product-img img-fluid rounded-3">
            </div>
            <div class="card-body text-center p-3">
              <h6 class="fw-bold text-dark mb-1"><?= esc($item['name']) ?></h6>
              <p class="fw-semibold text-success mb-1">₱<?= number_format($item['price'], 2) ?></p>
              <?php if ($item['stock'] > 0): ?>
                <small class="text-muted">In Stock: <?= esc($item['stock']) ?></small>
              <?php else: ?>
                <small class="text-danger fw-bold">Out of Stock</small>
              <?php endif; ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <p class="text-muted">No Smiski products available.</p>
    <?php endif; ?>
  </div>
</section>

<!-- === OTHER PRODUCTS SECTION === -->
<section id="others" class="py-4 mt-5">
  <h3 class="fw-bold mb-4 smiski-text">Other Products</h3>

  <div class="row g-4">
    <?php if (!empty($others)): ?>
      <?php foreach ($others as $item): ?>
        <div class="col-md-3 col-sm-6">
          <div class="product-card h-100 border-0 shadow-sm"
               data-bs-toggle="modal"
               data-bs-target="#productModal"
               data-name="<?= esc($item['name']) ?>"
               data-price="<?= number_format($item['price'], 2) ?>"
               data-stock="<?= $item['stock'] > 0 ? 'In Stock: '.$item['stock'] : 'Out of Stock' ?>"
               data-image="<?= base_url('uploads/' . esc($item['image'])) ?>"
               data-description="<?= esc($item['description'] ?? 'No description available') ?>">
            <div class="product-img-wrapper">
              <img src="<?= base_url('uploads/' . esc($item['image'])) ?>" 
                   alt="<?= esc($item['name']) ?>" class="product-img img-fluid rounded-3">
            </div>
            <div class="card-body text-center p-3">
              <h6 class="fw-bold text-dark mb-1"><?= esc($item['name']) ?></h6>
              <p class="fw-semibold text-success mb-1">₱<?= number_format($item['price'], 2) ?></p>
              <?php if ($item['stock'] > 0): ?>
                <small class="text-muted">In Stock: <?= esc($item['stock']) ?></small>
              <?php else: ?>
                <small class="text-danger fw-bold">Out of Stock</small>
              <?php endif; ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <p class="text-muted">No other products available.</p>
    <?php endif; ?>
  </div>
</section>

<!-- === PRODUCT MODAL === -->
<div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0 bg-light">
        <h5 class="modal-title fw-bold text-success" id="productModalTitle"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body d-flex flex-column flex-md-row align-items-start gap-4">
        <div class="modal-img-wrapper flex-shrink-0">
          <img id="productModalImage" src="" alt="" class="img-fluid rounded-3 shadow-sm">
        </div>
        <div class="modal-details text-dark">
          <p class="fw-bold text-success fs-5" id="productModalPrice"></p>
          <p id="productModalStock"></p>
          <p id="productModalDescription"></p>
        </div>
      </div>
    </div>
  </div>
</div>

<?= $this->include('templates/footer') ?>

<!-- === Bootstrap Icons & JS === -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- === JS FOR PRODUCT MODAL === -->
<script>
const productModal = document.getElementById('productModal');
productModal.addEventListener('show.bs.modal', function (event) {
  const card = event.relatedTarget;

  const name = card.getAttribute('data-name');
  const price = card.getAttribute('data-price');
  const stockText = card.getAttribute('data-stock');
  const image = card.getAttribute('data-image');
  const desc = card.getAttribute('data-description');

  document.getElementById('productModalTitle').textContent = name;
  document.getElementById('productModalPrice').textContent = '₱' + price;
  document.getElementById('productModalImage').src = image;
  document.getElementById('productModalDescription').textContent = desc;

  const stockEl = document.getElementById('productModalStock');
  stockEl.textContent = stockText;

  // Color logic for stock
  if (stockText.toLowerCase().includes('out of stock')) {
    stockEl.style.color = '#e63946'; 
    stockEl.style.fontWeight = '700';
  } else {
    stockEl.style.color = '#00c851';
    stockEl.style.fontWeight = '700';
  }
});
</script>
