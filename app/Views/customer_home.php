<?= $this->include('templates/header') ?>

<main>
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?= base_url('css/style.css') ?>">

    <!-- === HERO CAROUSEL === -->
    <div id="manualCarousel" class="carousel slide mb-5" data-bs-ride="carousel">
        <div class="carousel-inner rounded-4 shadow-sm overflow-hidden">

            <!-- CAROUSEL ITEMS -->
            <div class="carousel-item">
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
            <div class="carousel-item">
                <a href="https://smiski.com/e/products/plush/" target="_blank">
                    <img src="<?= base_url('uploads/smiski5.png') ?>" class="d-block w-100" alt="Smiski 5" style="object-fit:contain;">
                </a>
            </div>
            <div class="carousel-item active">
                <a href="https://smiski.com/e/products/touch-light-vol2/" target="_blank">
                    <img src="<?= base_url('uploads/smiski6.png') ?>" class="d-block w-100" alt="Smiski 5" style="object-fit:contain;">
                </a>
            </div>

        </div>

        <!-- CAROUSEL CONTROLS -->
        <button class="carousel-control-prev" type="button" data-bs-target="#manualCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#manualCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
    </div>

    <!-- === PRODUCT SECTION === -->
    <section id="all-products" class="py-5">
        <div class="container">

            <div class="text-center mb-5">
                <h2 class="fw-bold text-white display-6 mb-5">LATEST PRODUCTS</h2>
            </div>

            <?php
                $allProducts = array_merge($products ?? [], $others ?? []);
                usort($allProducts, fn($a, $b) => $b['id'] <=> $a['id']);
                $latestProducts = array_slice($allProducts, 0, 9);
            ?>

            <div class="product-slider-wrapper">
                <button class="slide-btn left" onclick="slideProducts(-300)">
                    <i class="bi bi-chevron-left"></i>
                </button>

                <div id="productSlider" class="product-slider">
                    <?php foreach ($latestProducts as $item): ?>
                        <div class="product-card-slide"
                             role="button"
                             data-bs-toggle="modal"
                             data-bs-target="#productModal"
                             data-name="<?= esc($item['name']) ?>"
                             data-price="<?= number_format($item['price'], 2) ?>"
                             data-stock="<?= esc($item['stock'] ?? 'In Stock') ?>"
                             data-image="<?= base_url('uploads/' . esc($item['image'])) ?>"
                             data-description="<?= esc($item['description'] ?? 'No description available.') ?>">

                            <div class="product-img-wrapper">
                                <img src="<?= base_url('uploads/' . esc($item['image'])) ?>"
                                     alt="<?= esc($item['name']) ?>"
                                     class="product-img">
                            </div>

                            <div class="text-center mt-2">
                                <h6 class="fw-bold text-dark mb-1"><?= esc($item['name']) ?></h6>
                                </p>
                            </div>

                        </div>
                    <?php endforeach; ?>
                </div>

                <button class="slide-btn right" onclick="slideProducts(1)">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>

            <!-- "VIEW ALL PRODUCTS" BUTTON -->
            <div class="text-center mt-5">
                <a href="<?= base_url('customer/shop') ?>"
                   class="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm">
                   View All Products →
                </a>
            </div>

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

        </div>
    </section>

    <!-- === ABOUT SMISKI FEATURE SECTION === -->
    <section id="about-smiski" class="py-5">
        <div class="container text-center">
            <div class="about-smiski-card mx-auto">
                <a href="<?= base_url('/customer/about') ?>">
                    <img src="<?= base_url('uploads/aboutsmiski.png') ?>"
                         alt="About Smiski"
                         class="about-smiski-img">
                </a>
            </div>
        </div>
    </section>

<?= $this->include('templates/footer') ?>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

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
        document.getElementById('productModalImage').src = image;
        document.getElementById('productModalImage').alt = name;
        document.getElementById('productModalDescription').textContent = desc;

    });

    function slideProducts(direction) {
        const slider = document.getElementById('productSlider');
        const card = slider.querySelector('.product-card-slide');
        if (!card) return;

        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const gap = parseInt(cardStyle.marginRight) || 20;

        // Distance to scroll = 3 cards + 3 gaps
        const scrollDistance = (cardWidth + gap) * 3;

        // Current scroll position
        const currentScroll = slider.scrollLeft;

        // Max scrollable position
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        // Calculate new target scroll position
        let targetScroll = currentScroll + scrollDistance * direction;

        // Clamp target scroll so it doesn't go beyond limits
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        // Scroll smoothly to target
        slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
</script>
