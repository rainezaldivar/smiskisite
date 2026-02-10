<?= $this->include('templates/header') ?>
<link rel="stylesheet" href="<?= base_url('css/style.css') ?>">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">

            <div class="card shadow-lg border-0" style="border-radius: 20px;">
                <div class="card-body text-center p-5"> 
                    <?php 
                        $profileImg = $user['profile_picture'] ?? 'profile.png';
                        $profileImgSrc = base_url('uploads/' . $profileImg);
                    ?>

                    <div class="mb-4 position-relative d-inline-block">
                        <img src="<?= $profileImgSrc ?>" 
                             alt="Profile"
                             class="rounded-circle shadow-sm"
                             style="width: 140px; height: 140px; object-fit: cover; border: 4px solid #fff;">
                    </div>

                    <h3 class="fw-bold text-dark"><?= esc($user['name']) ?></h3>
                    <p class="text-muted mb-4"><?= esc($user['email']) ?></p>

                    <form id="uploadForm" action="<?= base_url('profile/uploadProfilePicture') ?>" method="post" enctype="multipart/form-data">
                        <?= csrf_field() ?>
                        <input type="file" name="profile_picture" id="profilePictureInput" style="display:none;" onchange="this.form.submit()">
                        
                        <button type="button" onclick="document.getElementById('profilePictureInput').click();" 
                                class="btn btn-outline-success rounded-pill px-4">
                            <i class="bi bi-camera-fill me-2"></i>Change Photo
                        </button>
                    </form>

                    <hr class="my-4" style="opacity: 0.1;">

                    <div class="d-grid gap-2">
                        <a href="<?= base_url('logout') ?>" class="btn btn-danger rounded-pill fw-bold">
                            <i class="bi bi-box-arrow-right me-2"></i>Logout
                        </a>

                        <?php if(session()->get('role') !== 'admin'): ?>
                            <a href="<?= base_url('customer') ?>" class="btn btn-light text-muted rounded-pill mt-2">Back to Store</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<?= $this->include('templates/footer') ?>