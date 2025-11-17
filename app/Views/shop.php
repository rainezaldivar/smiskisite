<?= $this->include('templates/header') ?>

<main>
    <link rel="stylesheet" href="<?= base_url('css/shop.css') ?>">

    <section class="py-4">
        <div class="container">
            <div class="row">
                <!-- SIDEBAR: Categories -->
                <aside class="col-lg-2 mb-4">
                    <div class="shop-sidebar p-3 rounded-3 shadow-sm">
    <h5 class="mb-3 text-white">Category</h5>
    <div class="d-grid gap-2">
        <button id="tab-smiski" class="btn btn-outline-success text-start active">Smiski Figurines</button>
        <button id="tab-others" class="btn btn-outline-success text-start">Other Products</button>
    </div>
                    </div>
                </aside>

                <!-- MAIN CONTENT -->
                <div class="col-lg-10 main-content">
                    <!-- (tabs moved to sidebar) -->

                    <!-- SMISKI PRODUCTS -->
                    <div id="smiski-products" class="row g-4">
                <?php if (!empty($products)): ?>
                    <?php foreach ($products as $item): ?>
                        <div class="col-lg-3 col-md-4 col-sm-6 product-item">
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

            <!-- OTHER PRODUCTS with Pagination -->
            <div id="others-products-container" style="display:none;">
                <div id="others-products" class="row g-4"></div>
                <nav aria-label="Other products pagination" class="mt-4">
                    <ul class="pagination justify-content-center" id="others-pagination"></ul>
                </nav>
            </div>
        </div>
    </section>

    <!-- PRODUCT MODAL (unchanged) -->
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


<!-- OTHER PRODUCTS with Pagination -->
    <?php 
        $others = $others ?? [];
    ?>
        <div id="others-products-container" style="display:none;">
            <div id="others-products" class="row g-4"></div>
            <nav aria-label="Other products pagination" class="mt-4">
                <ul class="pagination justify-content-center" id="others-pagination"></ul>
            </nav>
        </div>

</main>

<?= $this->include('templates/footer') ?>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
    // Product modal code (unchanged)
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
        stockEl.style.color = stockText.toLowerCase().includes('out of stock') ? '#e63946' : '#00c851';
        stockEl.style.fontWeight = '700';
    });

    // Tab switching
    const tabSmiski = document.getElementById('tab-smiski');
    const tabOthers = document.getElementById('tab-others');
    const smiskiSection = document.getElementById('smiski-products');
    const othersContainer = document.getElementById('others-products-container');
    const othersProductsDiv = document.getElementById('others-products');
    const paginationUl = document.getElementById('others-pagination');

    // Other products data (from PHP var to JS)
    const othersData = <?= json_encode(array_map(function($item){
        return [
            'name' => $item['name'],
            'price' => number_format($item['price'], 2),
            'stock' => $item['stock'],
            'image' => base_url('uploads/' . $item['image']),
            'description' => $item['description'] ?? 'No description available',
        ];
    }, $others ?? [])); ?>;

    const itemsPerPage = 12;
    let currentPage = 1;

    function renderOthersProducts(page = 1) {
        othersProductsDiv.innerHTML = '';
        currentPage = page;

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = othersData.slice(start, end);

        if (paginatedItems.length === 0) {
            othersProductsDiv.innerHTML = '<p class="text-muted">No other products available.</p>';
            paginationUl.innerHTML = '';
            return;
        }

        paginatedItems.forEach(item => {
            const stockText = item.stock > 0 ? 'In Stock: ' + item.stock : 'Out of Stock';
            const stockClass = item.stock > 0 ? 'text-muted' : 'text-danger fw-bold';
            const productCard = document.createElement('div');
            productCard.className = 'col-lg-3 col-md-4 col-sm-6 product-item';
            productCard.innerHTML = `
                <div class="product-card h-100 border-0 shadow-sm"
                     data-bs-toggle="modal"
                     data-bs-target="#productModal"
                     data-name="${item.name}"
                     data-price="${item.price}"
                     data-stock="${stockText}"
                     data-image="${item.image}"
                     data-description="${item.description}">
                    <div class="product-img-wrapper">
                        <img src="${item.image}" alt="${item.name}" class="product-img img-fluid rounded-3">
                    </div>
                    <div class="card-body text-center p-3">
                        <h6 class="fw-bold text-dark mb-1">${item.name}</h6>
                        <p class="fw-semibold text-success mb-1">₱${item.price}</p>
                        <small class="${stockClass}">${stockText}</small>
                    </div>
                </div>
            `;
            othersProductsDiv.appendChild(productCard);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationUl.innerHTML = '';
        const totalPages = Math.ceil(othersData.length / itemsPerPage);

        // Previous Button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1">Previous</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                renderOthersProducts(currentPage - 1);
            }
        });
        paginationUl.appendChild(prevLi);

        // Page numbers
        for(let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                renderOthersProducts(i);
            });
            paginationUl.appendChild(pageLi);
        }

        // Next Button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                renderOthersProducts(currentPage + 1);
            }
        });
        paginationUl.appendChild(nextLi);
    }

    tabSmiski.addEventListener('click', () => {
        tabSmiski.classList.add('active');
        tabOthers.classList.remove('active');
        smiskiSection.style.display = 'flex';
        othersContainer.style.display = 'none';
    });

    tabOthers.addEventListener('click', () => {
        tabOthers.classList.add('active');
        tabSmiski.classList.remove('active');
        smiskiSection.style.display = 'none';
        othersContainer.style.display = 'block';
        renderOthersProducts(1);
    });

    // On page load, show smiski products by default
    window.addEventListener('DOMContentLoaded', () => {
        smiskiSection.style.display = 'flex';
        othersContainer.style.display = 'none';
    });
</script>
