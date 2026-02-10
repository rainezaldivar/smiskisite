<?= $this->include('templates/header') ?>

<main>
    <link rel="stylesheet" href="<?= base_url('css/shop.css') ?>">
    
    <div class="container-fluid py-5 main-shop-container">
        <div class="row">
            
            <div class="col-lg-2 mb-4">
                <div class="filter-panel">
                    
                    <div class="mb-4">
                        <label class="form-label text-uppercase small">Search</label>
                        <div class="search-wrapper w-100">
                            <i class="bi bi-search"></i>
                            <input type="text" id="searchInput" class="form-control search-input" 
                                   placeholder="Find a Smiski..." onkeyup="applyFilters()">
                        </div>
                    </div>

                    <hr class="filter-divider">

                    <div class="mb-4">
                        <label class="form-label text-uppercase small">Sort By Price</label>
                        <div class="d-flex flex-column gap-2">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="sortPrice" id="sortDefault" value="default" checked onchange="applyFilters()">
                                <label class="form-check-label" for="sortDefault">Recommended</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="sortPrice" id="sortLowHigh" value="low-high" onchange="applyFilters()">
                                <label class="form-check-label" for="sortLowHigh">Lowest to Highest</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="sortPrice" id="sortHighLow" value="high-low" onchange="applyFilters()">
                                <label class="form-check-label" for="sortHighLow">Highest to Lowest</label>
                            </div>
                        </div>
                    </div>

                    <hr class="filter-divider">

                    <div class="mb-2">
                        <label class="form-label text-uppercase small">Categories</label>
                        <div class="d-flex flex-column gap-2">
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="figures" id="catFigures" onchange="applyFilters()">
                                <label class="form-check-label" for="catFigures">Figures</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="plush" id="catPlush" onchange="applyFilters()">
                                <label class="form-check-label" for="catPlush">Plushies</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="keychains" id="catKeychains" onchange="applyFilters()">
                                <label class="form-check-label" for="catKeychains">Keychains</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="straps" id="catStraps" onchange="applyFilters()">
                                <label class="form-check-label" for="catStraps">Straps</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="lamps" id="catLamps" onchange="applyFilters()">
                                <label class="form-check-label" for="catLamps">Lamps</label>
                            </div>
                            
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="zipperbites" id="catZipper" onchange="applyFilters()">
                                <label class="form-check-label" for="catZipper">Zipperbites</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="toothbrush" id="catToothbrush" onchange="applyFilters()">
                                <label class="form-check-label" for="catToothbrush">Toothbrush Stands</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="stickers" id="catStickers" onchange="applyFilters()">
                                <label class="form-check-label" for="catStickers">Stickers</label>
                            </div>
                            
                            <div class="form-check">
                                <input class="form-check-input category-filter" type="checkbox" value="others" id="catOthers" onchange="applyFilters()">
                                <label class="form-check-label" for="catOthers">Others</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-lg-10">
                
                <div class="text-center mb-5">
                    <h2 class="shop-title m-0">All Products</h2>
                    <span class="text-success fw-bold small" id="result-count">Showing all items</span>
                </div>

                <div id="product-container" class="row g-4 mt-5">
                    <?php if (!empty($products)): ?>
                        <?php foreach ($products as $index => $item): ?>
                            <?php 
                                // === STRICT CATEGORIZATION LOGIC ===
                                $lowerName = strtolower($item['name']);
                                
                                // 1. SPECIFIC TYPES (Unahin para hindi ma-tag as others/figures)
                                if (strpos($lowerName, 'lamp') !== false || strpos($lowerName, 'light') !== false) {
                                    $catClass = 'lamps';
                                }
                                elseif (strpos($lowerName, 'plush') !== false) {
                                    $catClass = 'plush';
                                } 
                                elseif (strpos($lowerName, 'keychain') !== false) {
                                    $catClass = 'keychains';
                                } 
                                elseif (strpos($lowerName, 'strap') !== false) {
                                    $catClass = 'straps';
                                } 
                                elseif (strpos($lowerName, 'sticker') !== false) {
                                    $catClass = 'stickers';
                                }
                                
                                // 2. NEW SPECIFIC CATEGORIES (Hiwalay na sila sa Others)
                                elseif (strpos($lowerName, 'zipper') !== false || strpos($lowerName, 'bite') !== false) {
                                    $catClass = 'zipperbites';
                                }
                                elseif (strpos($lowerName, 'toothbrush') !== false || strpos($lowerName, 'stand') !== false) {
                                    $catClass = 'toothbrush';
                                }

                                // 3. STRICT "OTHERS" (Hippers & Cushions ONLY)
                                elseif (strpos($lowerName, 'hipper') !== false || strpos($lowerName, 'cushion') !== false) {
                                    $catClass = 'others';
                                }

                                // 4. FALLBACK: FIGURES
                                // Lahat ng 'Smiski' na hindi nahulog sa categories sa taas, dito babagsak.
                                elseif (strpos($lowerName, 'figure') !== false || strpos($lowerName, 'smiski') !== false) {
                                    $catClass = 'figures';
                                } 
                                else {
                                    // Extreme fallback
                                    $catClass = 'others';
                                }

                                // STOCK & NEW LOGIC
                                $stock = isset($item['stock']) ? $item['stock'] : 0; 
                                $isOutOfStock = ($stock <= 0);
                                
                                $createdAt = isset($item['created_at']) ? strtotime($item['created_at']) : 0;
                                $isNew = ($createdAt > strtotime('-30 days'));
                            ?>
                            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 product-item" 
                                 data-category="<?= $catClass ?>" 
                                 data-price="<?= $item['price'] ?>"
                                 data-name="<?= strtolower($item['name']) ?>">
                                
                                <div class="product-card card h-100 position-relative shadow-sm" 
                                     data-bs-toggle="modal" 
                                     data-bs-target="#modal-<?= $index ?>">
                                    
                                    <?php if ($isOutOfStock): ?>
                                        <span class="badge-out-of-stock">OUT OF STOCK</span>
                                    <?php elseif ($isNew): ?>
                                        <span class="badge-new">NEW</span>
                                    <?php endif; ?>

                                    <div class="product-img-wrapper">
                                        <img src="<?= base_url('uploads/' . $item['image']) ?>" 
                                             class="card-img-top" alt="<?= esc($item['name']) ?>">
                                    </div>
                                    
                                    <div class="card-body d-flex flex-column text-center p-3">
                                        <h6 class="card-title fw-bold mb-1 small"><?= esc($item['name']) ?></h6>
                                        <p class="card-text text-success fw-bold small mb-0">₱<?= number_format($item['price'], 2) ?></p>
                                    </div>
                                </div>

                                <div class="modal fade" id="modal-<?= $index ?>" tabindex="-1" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered modal-lg">
                                        <div class="modal-content custom-modal-structure border-0">
                                            
                                            <div class="row g-0 h-100">
                                                
                                                <div class="col-md-6 modal-img-col d-flex align-items-center justify-content-center position-relative">
                                                    <div class="bg-circle"></div>
                                                    <img src="<?= base_url('uploads/' . $item['image']) ?>" class="img-fluid modal-product-img position-relative">
                                                </div>

                                                <div class="col-md-6 modal-details-col p-4 p-lg-5 d-flex flex-column position-relative">
                                                    
                                                    <button type="button" class="btn-close-custom" data-bs-dismiss="modal">
                                                        <i class="bi bi-x-lg"></i>
                                                    </button>

                                                    <h2 class="modal-title-text mb-3 mt-4"><?= esc($item['name']) ?></h2>

                                                    <div class="d-flex align-items-center gap-3 mb-4">
                                                        <h3 class="modal-price m-0">₱<?= number_format($item['price'], 2) ?></h3>
                                                        
                                                        <?php if ($isOutOfStock): ?>
                                                            <span class="badge-status out-stock">Out of Stock</span>
                                                        <?php else: ?>
                                                            <span class="badge-status in-stock">
                                                                <i class="bi bi-box-seam me-1"></i> <?= $stock ?> in stock
                                                            </span>
                                                        <?php endif; ?>
                                                    </div>

                                                    <div class="modal-description-box mb-4">
                                                        <p class="text-muted m-0">
                                                            <?= esc($item['description']) ?>
                                                        </p>
                                                    </div>

                                                    <div class="mt-auto">
                                                        <?php if ($isOutOfStock): ?>
                                                            <button type="button" class="btn btn-secondary w-100 py-3 rounded-3 fw-bold disabled-btn" disabled>
                                                                Currently Unavailable
                                                            </button>
                                                        <?php else: ?>
                                                            <button type="button" class="btn btn-add-cart w-100 py-3 rounded-3 shadow-sm" 
                                                                    onclick="addToCart('<?= esc($item['name']) ?>', <?= $item['price'] ?>); $('#modal-<?= $index ?>').modal('hide');">
                                                                <div class="d-flex justify-content-between align-items-center px-3">
                                                                    <span>Add to Cart</span>
                                                                    <i class="bi bi-cart-plus-fill fs-5"></i>
                                                                </div>
                                                            </button>
                                                        <?php endif; ?>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

                <div id="no-results" class="text-center mt-5" style="display: none;">
                    <i class="bi bi-emoji-frown fs-1 text-success opacity-50"></i>
                    <h4 class="text-success mt-3">No Smiskis found hiding here.</h4>
                    <p class="text-muted">Try adjusting your filters.</p>
                </div>
            </div>

        </div>
    </div>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script>
    let cartTotal = 0;
    let cartCount = 0;

    function applyFilters() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const sortValue = document.querySelector('input[name="sortPrice"]:checked').value;
        const checkedCats = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);

        let cards = Array.from(document.querySelectorAll('.product-item'));
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.getAttribute('data-name');
            const category = card.getAttribute('data-category');
            
            const matchesSearch = name.includes(searchInput);
            const matchesCategory = checkedCats.length === 0 || checkedCats.includes(category);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const container = document.getElementById('product-container');
        const visibleCards = cards.filter(card => card.style.display !== 'none');

        if (sortValue !== 'default') {
            visibleCards.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price'));
                const priceB = parseFloat(b.getAttribute('data-price'));
                return sortValue === 'low-high' ? priceA - priceB : priceB - priceA;
            });
            visibleCards.forEach(card => container.appendChild(card));
        }

        const noResults = document.getElementById('no-results');
        const countDisplay = document.getElementById('result-count');
        
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            countDisplay.innerText = '0 items found';
        } else {
            noResults.style.display = 'none';
            countDisplay.innerText = `Showing ${visibleCount} items`;
        }
    }

    function addToCart(name, price) {
        cartCount++;
        cartTotal += price;
        
        let navBadge = document.getElementById('navbar-cart-count');
        if(navBadge) {
            navBadge.innerText = cartCount;
            navBadge.style.display = 'inline-block'; 
        }
        
        alert(name + " added to your cart!"); 
    }
</script>

<?= $this->include('templates/footer') ?>