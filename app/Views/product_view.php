<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/product_view.css') ?>">

<main class="container py-4 mb-5" style="max-width: 1080px; margin-top: 35px;">

    <div class="product-container p-4 p-md-5">
        <div class="row gx-5">
            
            <div class="col-lg-6 mb-4 mb-lg-0">
                <?php $imgSrc = !empty($product['image']) ? base_url('uploads/'.$product['image']) : base_url('uploads/default.png'); ?>
                
                <div class="main-image-box mb-3">
                    <img src="<?= $imgSrc ?>" id="mainProductImage" alt="<?= esc($product['name']) ?>" class="img-fluid" style="height: 380px; object-fit: contain;">
                </div>

                <div class="row g-2 thumbnail-row">
                    <div class="col-3">
                        <div class="thumbnail-box active-thumb" onclick="changeImage('<?= $imgSrc ?>', this)">
                            <img src="<?= $imgSrc ?>" class="img-fluid" alt="Main Angle">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="thumbnail-box" onclick="changeImage('<?= base_url('uploads/smiski_box.png') ?>', this)">
                            <img src="<?= base_url('uploads/smiski_box.png') ?>" onerror="this.src='<?= $imgSrc ?>'" class="img-fluid" alt="Box View">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="thumbnail-box" onclick="changeImage('<?= base_url('uploads/smiski_glow.png') ?>', this)">
                            <img src="<?= base_url('uploads/smiski_glow.png') ?>" onerror="this.src='<?= $imgSrc ?>'" class="img-fluid" alt="Glow View">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="thumbnail-box" onclick="changeImage('<?= base_url('uploads/smiski_back.png') ?>', this)">
                            <img src="<?= base_url('uploads/smiski_back.png') ?>" onerror="this.src='<?= $imgSrc ?>'" class="img-fluid" alt="Back View">
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 d-flex flex-column ps-lg-4">
                <h1 class="fw-bold mb-1 product-title"><?= esc($product['name']) ?></h1>
                <h2 class="fw-bold mb-3 product-price">₱<?= number_format($product['price'], 2) ?></h2>
                
                <div class="stock-status mb-3">
                    <?php if(isset($product['stock']) && $product['stock'] > 0): ?>
                        <span class="badge px-3 py-2 fs-6" style="background-color: transparent; border: 2px solid #2d7a1f; color: #2d7a1f;">
                            <i class="bi bi-circle-fill small me-1" style="font-size: 0.5rem;"></i> In stock
                        </span>
                    <?php else: ?>
                        <span class="badge px-3 py-2 fs-6" style="background-color: transparent; border: 2px solid #dc3545; color: #dc3545;">
                            <i class="bi bi-circle-fill small me-1" style="font-size: 0.5rem;"></i> Out of stock
                        </span>
                    <?php endif; ?>
                </div>

                <p class="mb-4 product-desc" style="line-height: 1.6;">
                    <?= esc($product['description'] ?? 'A curious little Smiski waiting to hide in your room. Handle with care and watch it glow beautifully in the dark.') ?>
                </p>

                <form action="<?= base_url('shop/add') ?>" method="post" class="mt-auto">
                    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                    <input type="hidden" name="product_name" value="<?= esc($product['name']) ?>">
                    <input type="hidden" name="product_price" value="<?= $product['price'] ?>">
                    <input type="hidden" name="product_image" value="<?= $product['image'] ?? 'default.png' ?>">

                    <div class="quantity-selector mb-5">
                        <label class="fw-bold mb-2 d-block fs-6" style="color: #1b4d13;">Quantity:</label>
                        <div class="input-group align-items-center quantity-wrapper">
                            <button class="btn qty-btn" type="button" onclick="updateQty(-1)">
                                <i class="bi bi-dash fs-5"></i>
                            </button>
                            <?php $initialQty = ($product['stock'] > 0) ? 1 : 0; ?>
                            <input type="text" class="form-control text-center border-0 fw-bold bg-transparent shadow-none" name="qty" id="productQty" value="<?= $initialQty ?>" readonly>
                            <button class="btn qty-btn" type="button" onclick="updateQty(1)">
                                <i class="bi bi-plus fs-5"></i>
                            </button>
                        </div>
                    </div>

                    <div class="d-flex gap-2 flex-column flex-sm-row mt-2">
                        <button type="submit" class="btn btn-add-cart flex-grow-1 fw-bold px-3 py-3 d-flex justify-content-center align-items-center gap-2" <?= ($product['stock'] <= 0) ? 'disabled' : '' ?>>
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                        
                        <button type="submit" formaction="<?= base_url('shop/directCheckout') ?>" class="btn btn-buy-now flex-grow-1 fw-bold px-3 py-3 d-flex justify-content-center align-items-center gap-2" <?= ($product['stock'] <= 0) ? 'disabled' : '' ?>>
                            Buy Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="mt-5 pt-4 p-2">
        <h3 class="fw-bold mb-4" style="color: #1b4d13; letter-spacing: 1px;">YOU MAY ALSO LIKE</h3>
        
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-2">
            
            <?php if(isset($randomProducts) && !empty($randomProducts)): ?>
                <?php foreach($randomProducts as $rec): ?>
                    <div class="col">
                        <a href="<?= base_url('shop/product/' . $rec['id']) ?>" class="rec-card">
                            <div class="rec-img-wrapper">
                                <?php $recImg = !empty($rec['image']) ? base_url('uploads/'.$rec['image']) : base_url('uploads/default.png'); ?>
                                <img src="<?= $recImg ?>" alt="<?= esc($rec['name']) ?>">
                            </div>
                            <div class="rec-info-container">
                                <div class="rec-brand">SMISKI</div>
                                <div class="rec-title"><?= esc($rec['name']) ?></div>
                                <div class="rec-price">₱<?= number_format($rec['price'], 2) ?></div>
                            </div>
                        </a>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12 text-center text-muted mt-3">
                    <p>No other products available right now.</p>
                </div>
            <?php endif; ?>

        </div>
    </div>

</main>

<div class="modal fade" id="cartSuccessModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg" style="background-color: #fcfcfc;">
            <div class="modal-body text-center p-4">
                <div class="mb-3">
                    <i class="bi bi-check-circle-fill" style="font-size: 3rem; color: #2d7a1f;"></i>
                </div>
                <h5 class="fw-bold mb-2" style="color: #2d7a1f;">Success!</h5>
                <p class="text-muted small mb-4">Item has been added to your shopping cart.</p>
                <button type="button" class="btn w-100 btn-buy-now fw-bold" data-bs-dismiss="modal">
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    function changeImage(src, element) {
        document.getElementById('mainProductImage').src = src;
        const thumbnails = document.querySelectorAll('.thumbnail-box');
        thumbnails.forEach(box => box.classList.remove('active-thumb'));
        element.classList.add('active-thumb');
    }

    const maxStock = <?= isset($product['stock']) ? (int)$product['stock'] : 0 ?>;

    function updateQty(change) {
        let input = document.getElementById('productQty');
        let currentVal = parseInt(input.value);
        
        if (maxStock === 0) return; 

        let newVal = currentVal + change;
        
        if(newVal >= 1 && newVal <= maxStock) { 
            input.value = newVal;
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        <?php if(session()->getFlashdata('success')): ?>
            var cartModal = new bootstrap.Modal(document.getElementById('cartSuccessModal'));
            cartModal.show();
        <?php endif; ?>
    });
</script>

<?= $this->include('templates/footer') ?>