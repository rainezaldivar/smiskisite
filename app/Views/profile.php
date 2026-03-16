<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/profile.css') ?>">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<main class="container dashboard-container mt-4 mb-5">
    <div class="row g-4 align-items-stretch">
        
        <div class="col-lg-3">
            <div class="profile-sidebar d-flex flex-column h-100">
                <div class="user-mini-profile">
                    <?php 
                        $imgName = !empty($user['profile_picture']) ? $user['profile_picture'] : 'profile.png';
                        $profileImgSrc = strpos($imgName, 'http') !== false ? $imgName : base_url('uploads/' . $imgName) . '?v=' . time();
                    ?>
                    <img src="<?= $profileImgSrc ?>" class="rounded-circle mb-2" width="90" height="90" style="object-fit:cover; border: 2px solid #2d7a1f;" alt="Avatar">
                    <h6 class="fw-bold text-dark mb-0"><?= esc($user['name']) ?></h6>
                </div>

                <div class="nav flex-column nav-pills flex-grow-1" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#tab-basic" type="button" role="tab"><i class="bi bi-person-badge"></i> Account Info</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-security" type="button" role="tab"><i class="bi bi-shield-lock"></i> Security</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-payment" type="button" role="tab"><i class="bi bi-credit-card"></i> Payment Methods</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-orders" type="button" role="tab"><i class="bi bi-bag-check"></i> My Purchases</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-preferences" type="button" role="tab"><i class="bi bi-sliders"></i> Preferences</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#tab-rewards" type="button" role="tab"><i class="bi bi-star"></i> Rewards</button>
                </div>
                
                <div class="logout-wrapper mt-auto">
                    <a href="<?= base_url('logout') ?>" class="logout-link"><i class="bi bi-box-arrow-right"></i> Log out</a>
                </div>
            </div>
        </div>

        <div class="col-lg-9">
            <div class="tab-content tab-content-card h-100" id="v-pills-tabContent">
                
                <div class="tab-pane fade show active" id="tab-basic" role="tabpanel">
                    <h3 class="section-title">Account Info</h3>
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <form id="uploadForm" action="<?= base_url('profile/uploadProfilePicture') ?>" method="post" enctype="multipart/form-data">
                                <?= csrf_field() ?>
                                <div class="avatar-upload-container">
                                    <img src="<?= $profileImgSrc ?>" class="avatar-preview" alt="Profile">
                                    <input type="file" name="profile_picture" id="profilePictureInput" accept="image/jpeg, image/png" style="display:none;" onchange="submitPhoto()">
                                    <button type="button" class="btn btn-outline-success btn-sm rounded-pill fw-bold mt-2" style="font-size: 0.8rem;" onclick="document.getElementById('profilePictureInput').click();">Change Avatar</button>
                                    <small class="text-muted d-block mt-1" style="font-size: 0.75rem;">Max: 5MB</small>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-9 mt-3 mt-md-0">
                            <form action="<?= base_url('profile/updateDetails') ?>" method="post">
                                <?= csrf_field() ?>
                                <h6 class="fw-bold text-success mb-3">Personal Details</h6>
                                <div class="row g-2 mb-4">
                                    <div class="col-md-6"><label class="form-label">Username</label><input type="text" class="form-control" value="<?= esc($user['name']) ?>" disabled></div>
                                    <div class="col-md-6"><label class="form-label">Full Name</label><input type="text" name="name" class="form-control" value="<?= esc($user['name']) ?>"></div>
                                    <div class="col-md-6"><label class="form-label">Email Address</label><input type="email" class="form-control" value="<?= esc($user['email']) ?>" disabled></div>
                                    <div class="col-md-6"><label class="form-label">Phone Number</label><input type="text" name="phone" class="form-control" value="<?= esc($user['phone'] ?? '') ?>" placeholder="+63 912 345 6789"></div>
                                    <div class="col-md-6">
                                        <label class="form-label">Gender</label>
                                        <select name="gender" class="form-select">
                                            <option value="">Select Gender</option>
                                            <option value="Male" <?= (isset($user['gender']) && $user['gender'] == 'Male') ? 'selected' : '' ?>>Male</option>
                                            <option value="Female" <?= (isset($user['gender']) && $user['gender'] == 'Female') ? 'selected' : '' ?>>Female</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6"><label class="form-label">Date of Birth</label><input type="date" name="dob" id="dobInput" class="form-control" value="<?= esc($user['dob'] ?? '') ?>" placeholder="Select Date"></div>
                                </div>

                                <h6 class="fw-bold text-success mb-3 border-top pt-3">Delivery Address</h6>
                                <div class="row g-2">
                                    <div class="col-12"><label class="form-label">Full Address (Street, Barangay)</label><input type="text" name="address" class="form-control" value="<?= esc($user['address'] ?? '') ?>" placeholder="e.g. 123 Rizal St, Brgy. San Jose"></div>
                                    <div class="col-md-6"><label class="form-label">City/Municipality</label><input type="text" name="city" class="form-control" value="<?= esc($user['city'] ?? '') ?>" placeholder="e.g. Quezon City"></div>
                                    <div class="col-md-6"><label class="form-label">Province</label><input type="text" name="province" class="form-control" value="<?= esc($user['province'] ?? '') ?>" placeholder="e.g. Metro Manila"></div>
                                </div>

                                <div class="col-12 mt-4 text-end">
                                    <button type="submit" class="btn btn-save shadow-sm w-100 w-md-auto" style="background-color: #2d7a1f; color: white;">Save All Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade" id="tab-security" role="tabpanel"><h3 class="section-title">Security Settings</h3></div>
                <div class="tab-pane fade" id="tab-payment" role="tabpanel"><h3 class="section-title">Payment Information</h3></div>
                <div class="tab-pane fade" id="tab-orders" role="tabpanel"><h3 class="section-title">My Purchases</h3></div>
                <div class="tab-pane fade" id="tab-preferences" role="tabpanel"><h3 class="section-title">Preferences</h3></div>
                <div class="tab-pane fade" id="tab-rewards" role="tabpanel"><h3 class="section-title">My Rewards</h3></div>
            </div>
        </div>
    </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
    function submitPhoto() {
        const fileInput = document.getElementById('profilePictureInput');
        if (fileInput.files.length > 0) document.getElementById('uploadForm').submit();
    }
    flatpickr("#dobInput", { altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", maxDate: "today" });

    const Toast = Swal.mixin({
        toast: true, position: 'center', showConfirmButton: false, timer: 3500, timerProgressBar: true
    });

    <?php if(session()->getFlashdata('success')): ?>
        Toast.fire({ icon: 'success', title: '<?= session()->getFlashdata('success') ?>', color: '#1b4d13', background: '#ebffcb' });
    <?php endif; ?>
    <?php if(session()->getFlashdata('error')): ?>
        Swal.fire({ icon: 'error', title: 'Oops...', text: '<?= session()->getFlashdata('error') ?>', confirmButtonColor: '#2d7a1f' });
    <?php endif; ?>
</script>

<?= $this->include('templates/footer') ?>