<?= $this->include('templates/header') ?>

<?php 
    // Check if user has an address
    $userAddress = trim($user['address'] ?? '');
    $isAddressComplete = !empty($userAddress);
?>

<link rel="stylesheet" href="<?= base_url('css/checkout.css') ?>">

<form action="<?= base_url('shop/placeOrder') ?>" method="post" id="checkoutForm">
    <main class="checkout-container">

        <h2 class="page-header fw-bold">Checkout</h2>

        <div class="checkout-card address-card">
            <div class="section-header">
                Delivery Address
            </div>
            <div class="address-details d-flex justify-content-between align-items-center">
                <div>
                    <p class="fw-bold text-dark mb-1"><?= esc($user['name']) ?> (+63) <?= esc($user['phone'] ?? '912 345 6789') ?></p>
                    <p class="text-muted small mb-0 <?= !$isAddressComplete ? 'text-danger fw-bold' : '' ?>">
                        <?= $isAddressComplete ? esc($userAddress) : 'No address provided. Please update your profile.' ?>
                    </p>
                </div>
                <a href="<?= base_url('profile') ?>" class="text-success text-decoration-none fw-bold small">Change</a>
            </div>
            <input type="hidden" name="name" value="<?= esc($user['name']) ?>">
            <input type="hidden" name="email" value="<?= esc($user['email']) ?>">
            <input type="hidden" name="address" value="<?= esc($userAddress) ?>">
        </div>

        <div class="checkout-card">
            
            <div class="table-header-row">
                <div class="col-product fw-bold">Product Ordered</div>
                <div class="col-price fw-bold">Price</div>
                <div class="col-qty fw-bold">Quantity</div>
                <div class="col-subtotal fw-bold">Item Subtotal</div>
            </div>

            <?php 
                $subtotal = 0;
                foreach($cart as $item): 
                    $itemTotal = $item['price'] * $item['qty'];
                    $subtotal += $itemTotal;
                    $imgSrc = $item['image'] ?? $item['img'] ?? 'default.png';
            ?>
            <div class="product-row">
                <div class="col-product">
                    <img src="<?= strpos($imgSrc, 'http') === 0 ? $imgSrc : base_url('uploads/'.$imgSrc) ?>" class="product-img" alt="<?= esc($item['name']) ?>">
                    <div>
                        <div class="fw-bold text-dark"><?= esc($item['name']) ?></div>
                        <div class="text-muted small mt-1">Variation: Standard</div>
                    </div>
                </div>
                <div class="col-price text-muted">
                    ₱<?= number_format($item['price'], 2) ?>
                </div>
                <div class="col-qty text-muted">
                    <?= $item['qty'] ?>
                </div>
                <div class="col-subtotal fw-bold text-dark">
                    ₱<?= number_format($itemTotal, 2) ?>
                </div>
            </div>
            <?php endforeach; ?>

            <div class="option-row mt-4">
                <div>
                    <span class="fw-bold text-dark">Merchandise Protection</span>
                    <div class="text-muted small">Protect your Smiski from accidental damage.</div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="text-dark fw-bold">₱15.00</span>
                    <input class="form-check-input fs-5 mt-0 border-success" type="checkbox" id="protectionCheck" value="15" onchange="calculateTotal()">
                </div>
            </div>
            
            <div class="option-row">
                <div>
                    <span class="fw-bold text-dark">Smiski Voucher</span>
                </div>
                <a href="#" class="text-muted text-decoration-none small">Select Voucher <i class="bi bi-chevron-right"></i></a>
            </div>
        </div>

        <div class="checkout-card">
            
            <div class="payment-header-row">
                <div class="section-header mb-0">Payment Method</div>
                <div class="d-flex align-items-center ms-auto">
                    <div class="payment-method-text" id="selectedPaymentText">Cash on Delivery</div>
                    <div class="btn-change" onclick="togglePaymentOptions()" style="cursor: pointer;">CHANGE</div>
                </div>
            </div>

            <div id="paymentOptionsContainer" style="display: none; padding-top: 16px; border-top: 1px solid #eef5e0; margin-top: 12px; margin-bottom: 16px;">
                <div class="payment-methods">
                    <div class="payment-btn active" onclick="selectPayment(this, 'cod', 'Cash on Delivery')" style="cursor: pointer;">Cash on Delivery</div>
                    <div class="payment-btn" onclick="selectPayment(this, 'gcash', 'GCash')" style="cursor: pointer;">GCash</div>
                    <div class="payment-btn" onclick="selectPayment(this, 'card', 'Credit/Debit Card')" style="cursor: pointer;">Credit/Debit Card</div>
                </div>
            </div>
            
            <input type="hidden" name="payment_method" id="selectedPayment" value="cod">
            
            <div class="payment-desc-box mb-5" id="paymentDescription">
                Pay with cash upon delivery. Please prepare the exact amount.
            </div>

            <hr style="border-color: #eef5e0; margin: 30px 0;">

            <div class="summary-container">
                <div class="summary-row">
                    <span>Merchandise Subtotal</span>
                    <span id="displaySubtotal" data-value="<?= $subtotal ?>">₱<?= number_format($subtotal, 2) ?></span>
                </div>
                
                <div class="summary-row">
                    <span>Shipping Subtotal</span>
                    <span>₱100.00</span>
                </div>
                
                <div class="summary-row" id="protectionRow" style="display: none; justify-content: space-between;">
                    <span>Merchandise Protection</span>
                    <span>₱15.00</span>
                </div>
                
                <div class="summary-row total-row mb-3">
                    <span class="total-label">Total Payment</span>
                    <span class="total-amount" id="displaySummaryTotal">₱<?= number_format($subtotal + 100, 2) ?></span>
                </div>

                <?php if(!$isAddressComplete): ?>
                    <div class="alert alert-warning text-center small p-2 mb-0 fw-bold" style="border-radius: 4px;">
                        <i class="bi bi-exclamation-triangle-fill"></i> Please complete your Delivery Address to place an order.
                    </div>
                <?php endif; ?>

                <button type="submit" class="btn-place-order shadow-sm" <?= !$isAddressComplete ? 'disabled' : '' ?>>Place Order</button>
            </div>
        </div>

    </main>
</form>

<script>
    // Payment descriptions mapping
    const paymentDescriptions = {
        'cod': 'Pay with cash upon delivery. Please prepare the exact amount.',
        'gcash': 'Pay conveniently using your GCash account. You will be redirected to the secure GCash portal after placing the order.',
        'card': 'Securely pay using your Credit or Debit card. All card transactions are encrypted and secured.'
    };

    // Toggle visibility of payment options
    function togglePaymentOptions() {
        let container = document.getElementById('paymentOptionsContainer');
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }

    // Handle payment method selection
    function selectPayment(element, method, text) {
        let buttons = document.querySelectorAll('.payment-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
        
        document.getElementById('selectedPayment').value = method;
        document.getElementById('selectedPaymentText').innerText = text;
        document.getElementById('paymentDescription').innerText = paymentDescriptions[method];
        
        document.getElementById('paymentOptionsContainer').style.display = 'none';
    }

    // Dynamic calculation including Merchandise Protection
    function calculateTotal() {
        let subtotal = parseFloat(document.getElementById('displaySubtotal').getAttribute('data-value'));
        let shipping = 100;
        let protectionBox = document.getElementById('protectionCheck');
        let protectionFee = protectionBox.checked ? parseFloat(protectionBox.value) : 0;
        
        // Fix for the broken styling line
        let protectionRow = document.getElementById('protectionRow');
        if (protectionRow) {
            protectionRow.style.display = protectionBox.checked ? 'flex' : 'none';
        }
        
        let total = subtotal + shipping + protectionFee;
        
        // Format the total with commas and 2 decimal places
        document.getElementById('displaySummaryTotal').innerText = '₱' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
</script>

<?= $this->include('templates/footer') ?>