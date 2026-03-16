<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/about.css') ?>">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<div class="slider-wrapper">
    
    <div class="slider-track" id="sliderTrack">
        
        <div class="section yellow">
            <img src="<?= base_url('uploads/about01.png') ?>" alt="Smiski About 1">
            <div class="text-box">
                <p>Smiski are curious little creatures that love hiding in small spaces and corners of your room.</p>
            </div>
        </div>

        <div class="section green">
            <img src="<?= base_url('uploads/about02.png') ?>" alt="Smiski About 2">
            <div class="text-box">
                <p>Although they like to stay hidden,</p>
            </div>
        </div>

        <div class="section yellow">
            <img src="<?= base_url('uploads/about03.gif') ?>" alt="Smiski About 3">
            <div class="text-box">
                <p>You might discover one at night as they mysteriously glow in the dark.</p>
            </div>
        </div>

        <div class="section green">
            <img src="<?= base_url('uploads/about04.png') ?>" alt="Smiski About 4">
            <div class="text-box">
                <p>It is interesting to see the many types of Smiski all with different personalities and character.</p>
                <a href="<?= base_url('customer/shop') ?>" class="btn-start">
                    Start Collecting <i class="bi bi-arrow-right-circle-fill ms-2"></i>
                </a>
            </div>
        </div>

    </div>

    <button class="nav-btn prev-btn" id="prevBtn" onclick="moveSlide(-1)">
        <i class="bi bi-chevron-left"></i>
    </button>
    <button class="nav-btn next-btn" id="nextBtn" onclick="moveSlide(1)">
        <i class="bi bi-chevron-right"></i>
    </button>

</div>

<script>
    let currentIndex = 0;
    const track = document.getElementById('sliderTrack');
    const sections = document.querySelectorAll('.section');
    const totalSlides = sections.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Function to update UI (Arrows + Background Color)
    function updateUI() {
        // 1. Hide/Show Arrows
        if (currentIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }

        if (currentIndex === totalSlides - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }

        // 2. Change Body Background Color based on active slide class
        const currentSection = sections[currentIndex];
        
        if (currentSection.classList.contains('green')) {
            document.body.style.backgroundColor = '#679e0b'; // Switch to Green
        } else {
            document.body.style.backgroundColor = '#fae91e'; // Switch to Yellow
        }
    }

    function moveSlide(direction) {
        const newIndex = currentIndex + direction;

        // Boundary Check
        if (newIndex < 0 || newIndex >= totalSlides) {
            return; 
        }

        currentIndex = newIndex;

        // Move the Slider Track
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}vw)`;

        updateUI();
    }

    // Initialize on load
    updateUI();

    // Keyboard Navigation Support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) moveSlide(-1);
        if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) moveSlide(1);
    });
</script>