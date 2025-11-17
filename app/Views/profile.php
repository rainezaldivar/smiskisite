<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/style.css') ?>">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">

            <div class="card shadow-lg border-0">
                <div class="card-body text-center">

                    <?php 
                        // === GET IMAGE NAME FROM DATABASE ===
                        $profileImg = $user['profile_picture'] ?? null;

                        // === SET CORRECT UPLOAD DIRECTORY FOR CI4 ===
                        $uploadsPath = WRITEPATH . 'uploads/';

                        // === CHECK IF UPLOADED IMAGE EXISTS ===
                        if ($profileImg && file_exists($uploadsPath . $profileImg)) {
                            $profileImgSrc = base_url('profile/picture/' . $profileImg);
                        } else {
                            // === USE DEFAULT PLACEHOLDER IF NO IMAGE ===
                            $placeholder = (session()->get('role') === 'admin') ? 'adprofile.png' : 'profile.png';
                            $profileImgSrc = base_url('uploads/' . $placeholder);
                        }
                    ?>

                    <!-- === PROFILE IMAGE DISPLAY === -->
                    <img src="<?= $profileImgSrc ?>" 
                         alt="Profile Picture"
                         class="rounded-circle mb-3"
                         style="width: 120px; height: 120px; object-fit: cover;">

                    <!-- === PROFILE PICTURE UPLOAD FORM === -->
                    <form id="uploadForm" 
                          action="<?= base_url('profile/uploadProfilePicture') ?>" 
                          method="post" 
                          enctype="multipart/form-data">
                        
                        <?= csrf_field() ?> <!-- === CSRF PROTECTION FIELD === -->

                        <!-- === HIDDEN FILE INPUT === -->
                        <input 
                            type="file" 
                            name="profile_picture" 
                            id="profilePictureInput" 
                            accept="image/*" 
                            style="display:none;">
                        
                        <!-- === CHANGE PHOTO BUTTON === -->
                        <button type="button" 
                                id="changePhotoBtn" 
                                class="btn btn-primary btn-sm mb-3">
                            Change Photo
                        </button>
                    </form>

                    <!-- === SUCCESS MESSAGE === -->
                    <?php if(session()->getFlashdata('success')): ?>
                        <div class="alert alert-success"><?= session()->getFlashdata('success') ?></div>
                    <?php endif; ?>

                    <!-- === ERROR MESSAGE === -->
                    <?php if(session()->getFlashdata('error')): ?>
                        <div class="alert alert-danger"><?= session()->getFlashdata('error') ?></div>
                    <?php endif; ?>

                    <!-- === USER NAME AND EMAIL DISPLAY === -->
                    <h4 class="fw-bold mb-0 text-dark"><?= esc($user['name'] ?? 'Customer Name') ?></h4>
                    <p class="text-muted mb-3"><?= esc($user['email'] ?? 'email@example.com') ?></p>

                    <hr>

                    <!-- === MEMBER SINCE INFO === -->
                    <p class="mb-2"><strong>Member Since:</strong> <?= esc($user['created_at'] ?? '2025') ?></p>

                    <div class="mt-4">
                        <!-- === BACK TO STORE BUTTON FOR NON-ADMIN USERS === -->
                        <?php if(session()->get('role') !== 'admin'): ?>
                            <a href="<?= base_url('customer') ?>" class="btn btn-secondary">Back to Store</a>
                        <?php endif; ?>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // === OPEN FILE SELECTOR WHEN CHANGE PHOTO BUTTON IS CLICKED ===
    document.getElementById('changePhotoBtn').addEventListener('click', function() {
        document.getElementById('profilePictureInput').click();
    });

    // === AUTO SUBMIT FORM WHEN FILE IS SELECTED ===
    document.getElementById('profilePictureInput').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.getElementById('changePhotoBtn').disabled = true; // === DISABLE BUTTON WHILE UPLOADING ===
            document.getElementById('uploadForm').submit(); // === SUBMIT FORM ===
        }
    });
</script>

<?= $this->include('templates/footer') ?>
