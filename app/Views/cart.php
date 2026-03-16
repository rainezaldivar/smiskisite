<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/cart.css') ?>">

<div class="cart-container mt-4 mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="section-title fs-3">My Shopping Cart</h2>
        <span class="badge bg-success rounded-pill px-3 py-2" style="font-size: 0.85rem;"><?= count($cart) ?> items</span>
    </div>

    <div class="cart-main-card mb-3">
        <?php if(empty($cart)): ?>
            <div class="text-center py-5">
                <h5 class="fw-bold mt-3" style="color: #2d7a1f;">Your cart is empty.</h5>
                <p class="text-muted mb-4 small">Looks like you haven't made your choice yet.</p>
                <a href="<?= base_url('customer/shop') ?>" class="btn-go-shopping">Go Shopping</a>
            </div>
        <?php else: ?>
            <div class="cart-header-row text-muted pb-2 border-bottom fw-bold" style="font-size: 0.9rem;">
                <div class="d-flex align-items-center justify-content-center"></div>
                <div>Product</div>
                <div>Price</div>
                <div class="text-center">Quantity</div>
                <div>Total Price</div>
                <div class="text-center">Action</div>
            </div>

            <?php 
                foreach($cart as $id => $item): 
                    $subtotal = $item['price'] * $item['qty'];
                    $imgSrc = $item['image'] ?? $item['img'] ?? 'default.png';
            ?>
            <div class="cart-item-row border-bottom py-2">
                
                <div class="d-flex align-items-center justify-content-center" data-label="Select">
                    <input type="checkbox" class="form-check-input custom-checkbox item-checkbox" value="<?= $id ?>" data-subtotal="<?= $subtotal ?>">
                </div>

                <div class="product-details" data-label="Product">
                    <div class="img-wrapper">
                        <img src="<?= strpos($imgSrc, 'http') === 0 ? $imgSrc : base_url('uploads/'.$imgSrc) ?>" alt="<?= esc($item['name']) ?>">
                    </div>
                    <div>
                        <div class="product-name" style="font-size: 1rem;"><?= esc($item['name']) ?></div>
                        <div class="product-variant" style="font-size: 0.8rem;">Variation: Standard</div>
                    </div>
                </div>
                
                <div class="price-tag d-flex align-items-center" style="font-size: 0.95rem;" data-label="Price">
                    ₱<?= number_format($item['price'], 2) ?>
                </div>
                
                <div class="d-flex justify-content-center align-items-center" data-label="Quantity">
                    <form action="<?= base_url('cart/update') ?>" method="post" class="qty-control m-0">
                        <?= csrf_field() ?>
                        <input type="hidden" name="rowid" value="<?= $id ?>">
                        <button type="submit" name="action" value="minus" class="btn-qty"><i class="bi bi-dash"></i></button>
                        <input type="text" name="qty" value="<?= $item['qty'] ?>" readonly>
                        <button type="submit" name="action" value="plus" class="btn-qty"><i class="bi bi-plus"></i></button>
                    </form>
                </div>
                
                <div class="price-tag fw-bold d-flex align-items-center" style="font-size: 0.95rem;" data-label="Total Price">
                    ₱<?= number_format($subtotal, 2) ?>
                </div>
                
                <div class="d-flex justify-content-center align-items-center" data-label="Action">
                    <a href="<?= base_url('cart/remove/'.$id) ?>" class="btn-remove" title="Remove Item">
                        <i class="bi bi-trash3-fill"></i>
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <?php if(!empty($cart)): ?>
    <div class="summary-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 w-100">
        
        <div class="d-flex align-items-center gap-2">
            <input type="checkbox" class="form-check-input custom-checkbox" id="selectAllBottom">
            <label for="selectAllBottom" class="fw-bold text-muted mb-0" style="cursor: pointer; font-size: 0.95rem;">Select All</label>
        </div>

        <div class="d-flex flex-column flex-md-row align-items-md-center gap-3">
            <div class="text-md-end">
                <span class="text-muted me-2" style="font-size: 0.9rem;">Total Payment:</span>
                <span class="fs-4 fw-bold text-success price-tag" id="totalPaymentDisplay">₱0.00</span>
            </div>
            <div>
                <button type="button" id="btnCheckout" class="btn-checkout d-inline-block text-center text-decoration-none" disabled>
                    Proceed to Checkout
                </button>
            </div>
        </div>
    </div>
    
    <form id="checkoutSubmitForm" action="<?= base_url('shop/checkout') ?>" method="post">
        <?= csrf_field() ?>
    </form>
    <?php endif; ?>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const selectAllCheckbox = document.getElementById('selectAllBottom');
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        const totalDisplay = document.getElementById('totalPaymentDisplay');
        const btnCheckout = document.getElementById('btnCheckout');
        const checkoutSubmitForm = document.getElementById('checkoutSubmitForm');

        function calculateTotal() {
            let currentTotal = 0;
            let checkedCount = 0;

            itemCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    currentTotal += parseFloat(checkbox.getAttribute('data-subtotal'));
                    checkedCount++;
                }
            });

            totalDisplay.innerText = '₱' + currentTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            if (checkedCount === 0) {
                btnCheckout.disabled = true;
            } else {
                btnCheckout.disabled = false;
            }

            if (selectAllCheckbox) {
                selectAllCheckbox.checked = (checkedCount === itemCheckboxes.length && itemCheckboxes.length > 0);
            }
        }

        itemCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', calculateTotal);
        });

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                itemCheckboxes.forEach(function(checkbox) {
                    checkbox.checked = selectAllCheckbox.checked;
                });
                calculateTotal();
            });
        }

        if (btnCheckout) {
            btnCheckout.addEventListener('click', function() {
                if (btnCheckout.disabled) return;
                checkoutSubmitForm.innerHTML = '<?= csrf_field() ?>'; 
                itemCheckboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        let input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'selected_items[]';
                        input.value = checkbox.value;
                        checkoutSubmitForm.appendChild(input);
                    }
                });
                checkoutSubmitForm.submit();
            });
        }
        calculateTotal();
    });
</script>

<?= $this->include('templates/footer') ?>