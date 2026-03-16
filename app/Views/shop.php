<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/shop.css') ?>">

<main class="shop-wrapper py-4 mt-4">
    <?php if(session()->getFlashdata('error')): ?>
        <div class="alert alert-danger mb-4"><?= session()->getFlashdata('error') ?></div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-3 col-md-4 mb-4 pe-lg-5">
            <div class="sidebar-filter sticky-top" style="top: 140px; margin-top: 20px;">
                <h5 class="sidebar-title">Categories</h5>
                
                <div class="category-checkbox-list">
                    <?php 
                        $categories = [
                            'Figurines', 
                            'Keychain', 
                            'Lamp', 
                            'Others', 
                            'Plush', 
                            'Plush Keychain', 
                            'Sticker', 
                            'Strap', 
                            'Toothbrush Stand', 
                            'Zipperbite'
                        ];
                        
                        $currentCatArray = [];
                        if (!empty($currentCategory)) {
                            $currentCatArray = is_array($currentCategory) ? $currentCategory : [$currentCategory];
                        }
                        
                        foreach($categories as $cat): 
                            $isChecked = in_array($cat, $currentCatArray) ? 'checked' : '';
                    ?>
                        <div class="form-check d-flex align-items-center gap-2">
                            <input class="form-check-input custom-cat-checkbox cat-filter" type="checkbox" value="<?= esc($cat) ?>" id="cat_<?= md5($cat) ?>" <?= $isChecked ?>>
                            <label class="form-check-label cat-label mb-0 w-100" for="cat_<?= md5($cat) ?>">
                                <?= esc($cat) ?>
                            </label>
                        </div>
                    <?php endforeach; ?>
                </div>

            </div>
        </div>

        <div class="col-lg-9 col-md-8">
            
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-2 border-bottom border-success border-opacity-25">
                
                <h2 class="section-title mb-3 mb-sm-0">
                    <?= empty($currentCatArray) ? 'All Products' : esc(implode(', ', $currentCatArray)) ?>
                </h2>
                
                <div class="sort-box d-flex align-items-center gap-2">
                    <label for="sortDropdown" class="mb-0 fw-bold">Sort By:</label>
                    <select id="sortDropdown" class="form-select form-select-sm shadow-none w-auto">
                        <option value="latest" <?= ($currentSort == 'latest') ? 'selected' : '' ?>>Latest Arrival</option>
                        <option value="best_selling" <?= ($currentSort == 'best_selling') ? 'selected' : '' ?>>Best Selling</option>
                        <option value="price_asc" <?= ($currentSort == 'price_asc') ? 'selected' : '' ?>>Price - Low to High</option>
                        <option value="price_desc" <?= ($currentSort == 'price_desc') ? 'selected' : '' ?>>Price - High to Low</option>
                    </select>
                </div>
            </div>

            <div class="row g-3">
                <?php if(empty($products)): ?>
                    <div class="col-12 text-center py-5">
                        <h5 class="text-muted">No products found for the selected categories.</h5>
                    </div>
                <?php else: ?>
                    <?php foreach($products as $p): ?>
                        <div class="col-lg-3 col-md-4 col-sm-6">
                            <a href="<?= base_url('shop/product/' . $p['id']) ?>" class="text-decoration-none">
                                <div class="minimalist-product-card">
                                    <div class="product-img-container">
                                        <?php if(isset($p['stock']) && $p['stock'] <= 0): ?>
                                            <span class="badge-out-stock" style="font-family: 'Winky Rough', cursive, sans-serif;">OUT OF STOCK</span>
                                        <?php elseif(isset($p['is_new']) && $p['is_new'] == 1): ?>
                                            <span class="badge-new" style="font-family: 'Winky Rough', cursive, sans-serif;">NEW</span>
                                        <?php endif; ?>
                                        
                                        <?php $imgSrc = !empty($p['image']) ? base_url('uploads/'.$p['image']) : base_url('uploads/default.png'); ?>
                                        <img src="<?= $imgSrc ?>" alt="<?= esc($p['name']) ?>">
                                    </div>
                                    <div class="product-info-container">
                                        <div class="brand-name">SMISKI</div>
                                        <div class="product-name"><?= esc($p['name']) ?></div>
                                        <div class="product-price">₱<?= number_format($p['price'], 2) ?></div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<div class="modal fade" id="cartSuccessModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 20px; background-color: #fcfcfc;">
            <div class="modal-body text-center p-4">
                <div class="mb-3">
                    <i class="bi bi-check-circle-fill" style="font-size: 3rem; color: #2d7a1f;"></i>
                </div>
                <h5 class="fw-bold mb-2" style="color: #2d7a1f;">Success!</h5>
                <p class="text-muted small mb-4">Item has been added to your shopping cart.</p>
                <button type="button" class="btn w-100 rounded-pill" style="background-color: #2d7a1f; color: white; font-weight: bold;" data-bs-dismiss="modal">
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Modal for success
        <?php if(session()->getFlashdata('success')): ?>
            var cartModal = new bootstrap.Modal(document.getElementById('cartSuccessModal'));
            cartModal.show();
        <?php endif; ?>

        // Checkbox & Sort Filtering Logic
        function applyFilters() {
            let checkedCats = [];
            document.querySelectorAll('.cat-filter:checked').forEach(function(cb) {
                checkedCats.push('category[]=' + encodeURIComponent(cb.value));
            });
            
            let sort = document.getElementById('sortDropdown').value;
            
            // AUTOMATIC NA BABASAHIN YUNG CURRENT URL MO
            let url = window.location.pathname + '?sort=' + sort;
            
            if (checkedCats.length > 0) {
                url += '&' + checkedCats.join('&');
            }
            
            window.location.href = url;
        }

        // Trigger auto-submit when a checkbox is clicked
        document.querySelectorAll('.cat-filter').forEach(function(cb) {
            cb.addEventListener('change', applyFilters);
        });

        // Trigger auto-submit when sort is changed
        document.getElementById('sortDropdown').addEventListener('change', applyFilters);
    });
</script>

<?= $this->include('templates/footer') ?>