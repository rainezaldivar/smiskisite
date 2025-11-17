<?= $this->include('templates/header') ?>

<!-- ==== CUSTOM CSS FOR ABOUT PAGE ==== -->
<link rel="stylesheet" href="<?= base_url('css/about.css') ?>">

<!-- ==== FIRST SECTION ==== -->
<div class="section yellow">
    <img src="/uploads/about01.png" alt="Smiski About 1">
    <div class="text-box">
        <p>Smiski are curious little creatures that love hiding in small spaces and corners of your room.</p>
    </div>
</div>

<!-- ==== SECOND SECTION ==== -->
<div class="section green">
    <img src="/uploads/about02.png" alt="Smiski About 2">
    <div class="text-box">
        <p>Although they like to stay hidden,</p>
    </div>
</div>

<!-- ==== THIRD SECTION (WITH TRANSITION EFFECT) ==== -->
<div class="section yellow yellow-transition">
    <img src="/uploads/about03.gif" alt="Smiski About 3">
    <div class="text-box">
        <p>You might discover one at night as they mysteriously glow in the dark.</p>
    </div>
</div>

<!-- ==== FOURTH SECTION ==== -->
<div class="section green">
    <img src="/uploads/about04.png" alt="Smiski About 4">
    <div class="text-box">
        <p>It is interesting to see the many types of Smiski all with different personalities and character.</p>
    </div>
</div>

<!-- ==== SCROLL BUTTONS ==== -->
<div class="scroll-buttons">
    <button id="scrollUp" class="scroll-btn">▲</button>
    <button id="scrollDown" class="scroll-btn">▼</button>
</div>

<?= $this->include('templates/footer') ?>



<script>
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    let index = 0;

    function scrollToSection(i) {
        sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.getElementById("scrollUp").addEventListener("click", () => {
        index = Math.max(0, index - 1);
        scrollToSection(index);
    });

    document.getElementById("scrollDown").addEventListener("click", () => {
        index = Math.min(sections.length - 1, index + 1);
        scrollToSection(index);
    });

    window.addEventListener("scroll", () => {
        let current = 0;
        sections.forEach((sec, i) => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5) current = i;
        });
        index = current;
    });
});
</script>
