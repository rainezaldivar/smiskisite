<?= $this->include('templates/header') ?>

<style>
    body {
    background-color: #ebffcb;
    font-family: 'Winky Rough', sans-serif;
    color: #4a4a4a;
    padding-top: 130px;
    padding-bottom: 50px;
}
    .success-card {
        background-color: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .success-icon-wrapper {
        width: 80px;
        height: 80px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px auto;
    }
    .success-icon {
        font-size: 2.5rem;
        color: #2D7A1F;
    }
    
    .btn-custom-smiski {
        background-color: #2E7D32;
        border: none;
        color: white;
        border-radius: 12px; 
        font-family: 'Nunito', sans-serif;
        font-weight: 700;
        text-shadow: 0 1px 1px rgba(255,255,255,0.7);
        padding: 18px 50px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all 0.3s ease;
        line-height: 1;
        width: auto;
    }
    
    .btn-custom-smiski:hover {
        background-color: #1B5E20;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
        color: white;
    }
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">

<main class="container py-5 mt-5 mb-5 text-center">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="card success-card p-5 text-center">
                
                <div class="success-icon-wrapper">
                    <i class="bi bi-check-lg success-icon"></i>
                </div>
                
                <h2 class="fw-bold mb-3" style="color: #2D7A1F;">Order Confirmed!</h2>
                
                <p class="text-muted mb-4" style="font-size: 0.95rem;">
                    Yay! Your Smiskis are getting ready for their journey. We'll ship them to your location very soon.
                </p>
                
                <a href="<?= base_url('customer/shop') ?>" class="btn-custom-smiski shadow-sm">
                    Continue Shopping
                </a>
                
            </div>
        </div>
    </div>
</main>

<?= $this->include('templates/footer') ?>