<?= $this->include('templates/header') ?>

<main>
    <link rel="stylesheet" href="<?= base_url('css/style.css?v=' . time()) ?>">

    <section class="hero-section">
        <div id="manualCarousel" class="carousel slide shadow-lg" data-bs-ride="carousel" data-bs-interval="4000">
            
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#manualCarousel" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#manualCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#manualCarousel" data-bs-slide-to="2"></button>
                <button type="button" data-bs-target="#manualCarousel" data-bs-slide-to="3"></button>
                <button type="button" data-bs-target="#manualCarousel" data-bs-slide-to="4"></button>
            </div>

            <div class="carousel-inner">
                <div class="carousel-item active">
                    <a href="https://smiski.com/e/products/strap-accessories-series3/" target="_blank">
                        <img src="<?= base_url('uploads/smiski2.png') ?>" class="d-block w-100" alt="Smiski Accessories">
                    </a>
                </div>
                <div class="carousel-item">
                    <a href="https://smiski.com/e/products/touch-light-vol2/" target="_blank">
                        <img src="<?= base_url('uploads/smiski6.png') ?>" class="d-block w-100" alt="Smiski Touch Light">
                    </a>
                </div>
                <div class="carousel-item">
                    <a href="https://smiski.com/e/products/strap-accessories-series2/" target="_blank">
                        <img src="<?= base_url('uploads/smiski1.png') ?>" class="d-block w-100" alt="Smiski Accessories">
                    </a>
                </div>
                <div class="carousel-item">
                    <a href="https://smiski.com/e/products/plush/" target="_blank">
                        <img src="<?= base_url('uploads/smiski5.png') ?>" class="d-block w-100" alt="Smiski Plush">
                    </a>
                </div>
                <div class="carousel-item">
                    <a href="https://smiski.com/e/products/cushion-pouch/" target="_blank">
                        <img src="<?= base_url('uploads/smiski4.webp') ?>" class="d-block w-100" alt="Smiski Plush">
                    </a>
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#manualCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#manualCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </section>

    <section class="section-padding" id="featured-series">
        <div class="container text-center">
            
            <h2 class="section-title">Featured Series</h2>
            <div class="green-underline mx-auto"></div>

            <div class="slider-container position-relative">
                <button class="slider-btn left shadow-sm" onclick="slideContainer('featuredSlider', -1)">
                    <i class="bi bi-chevron-left"></i>
                </button>

                <div class="product-slider" id="featuredSlider">
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/birthday_yum.png') ?>" alt="Birthday Series"></div>
                        <div class="card-content"><h5>Birthday Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/sunday_guitar.png') ?>" alt="Sunday Series"></div>
                        <div class="card-content"><h5>Sunday Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/moving_fall.png') ?>" alt="Moving Series"></div>
                        <div class="card-content"><h5>Moving Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/work_approved.png') ?>" alt="Work Series"></div>
                        <div class="card-content"><h5>Work Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/museum_pearl.png') ?>" alt="Museum Series"></div>
                        <div class="card-content"><h5>Museum Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    <div class="product-card-slide">
                        <div class="img-wrapper"><img src="<?= base_url('uploads/exercise_balance.png') ?>" alt="Exercising Series"></div>
                        <div class="card-content"><h5>Exercising Series</h5><a href="<?= base_url('customer/shop') ?>" class="btn btn-pick-now">View</a></div>
                    </div>
                    
   
                </div>

                <button class="slider-btn right shadow-sm" onclick="slideContainer('featuredSlider', 1)">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </section>

    <section class="section-padding bg-white">
        <div class="container">
            <div class="d-flex justify-content-between align-items-end mb-4 px-2">
                <div>
                    <h2 class="section-title text-start mb-0">Explore Our <br>Categories</h2>
                    <div class="green-underline ms-1 mb-0" style="width: 60px;"></div>
                </div>
                <a href="<?= base_url('customer/shop') ?>" class="text-decoration-none fw-bold d-none d-md-block" style="color: #2d7a1f;">
                    View full catalog <i class="bi bi-arrow-right"></i>
                </a>
            </div>

            <div class="categories-grid">
                <a href="<?= base_url('customer/shop?category=Figurines') ?>" class="cat-card hero-card">
                    <img src="<?= base_url('uploads/cheerdancing.png') ?>" alt="Figurines">
                    <div class="cat-overlay"><h3>Figurines</h3><span class="cat-cta">View all <i class="bi bi-arrow-right"></i></span></div>
                </a>
                <a href="<?= base_url('customer/shop?category=Straps') ?>" class="cat-card">
                    <img src="<?= base_url('uploads/strapv.3.png') ?>" alt="Straps">
                    <div class="cat-overlay"><h3>Straps</h3><span class="cat-cta">View all <i class="bi bi-arrow-right"></i></span></div>
                </a>
                <a href="<?= base_url('customer/shop?category=TouchLights') ?>" class="cat-card">
                    <img src="<?= base_url('uploads/touchlight2.1.png') ?>" alt="Touch Lights">
                    <div class="cat-overlay"><h3>Touch Lights</h3><span class="cat-cta">View all <i class="bi bi-arrow-right"></i></span></div>
                </a>
                <a href="<?= base_url('customer/shop?category=Plushies') ?>" class="cat-card">
                    <img src="<?= base_url('uploads/plush.2.png') ?>" alt="Plushies">
                    <div class="cat-overlay"><h3>Plushies</h3><span class="cat-cta">View all <i class="bi bi-arrow-right"></i></span></div>
                </a>
                <a href="<?= base_url('customer/shop?category=Stickers') ?>" class="cat-card">
                    <img src="<?= base_url('uploads/sticker_smiski.png') ?>" alt="Stickers">
                    <div class="cat-overlay"><h3>Stickers</h3><span class="cat-cta">View all <i class="bi bi-arrow-right"></i></span></div>
                </a>
            </div>
        </div>
    </section>

    <section class="section-padding">
        <div class="container text-center">
            <h2 class="section-title">Browse Products</h2>
            <div class="green-underline mx-auto mb-5"></div>
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
                <?php $limitProducts = isset($products) ? array_slice($products, 0, 8) : []; ?>
                <?php if(!empty($limitProducts)): ?>
                    <?php foreach ($limitProducts as $product): ?>
                        <div class="col">
                            <a href="<?= base_url('customer/product_details/' . $product['id']) ?>" class="text-decoration-none">
                                <div class="browse-card h-100 shadow-sm">
                                    <div class="browse-img">
                                        <img src="<?= base_url('uploads/' . $product['image']) ?>" alt="<?= $product['name'] ?>">
                                    </div>
                                    <div class="browse-details">
                                        <h6 class="browse-title"><?= $product['name'] ?></h6>
                                        <p class="browse-price">₱ <?= number_format($product['price'], 2) ?></p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="col-12"><p class="text-muted">No products available yet.</p></div>
                <?php endif; ?>
            </div>
            <div class="mt-5">
                <a href="<?= base_url('customer/shop') ?>" class="btn btn-view-all">View More <i class="bi bi-arrow-right ms-2"></i></a>
            </div>
        </div>
    </section>

    <section id="about-smiski" class="about-section">
        <div class="container text-center">
            <div class="about-card-wrapper shadow-lg">
                <a href="<?= base_url('/customer/about') ?>">
                    <img src="<?= base_url('uploads/aboutsmiski.png') ?>" alt="About Smiski" class="img-fluid w-100">
                </a>
            </div>
        </div>
    </section>

</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script>
    function slideContainer(elementId, direction) {
        const container = document.getElementById(elementId);
        if(container) {
            const scrollAmount = container.clientWidth;
            container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        }
    }
</script>

<?= $this->include('templates/footer') ?>