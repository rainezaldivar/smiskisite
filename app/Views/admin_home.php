<?= $this->include('templates/header') ?>

<!-- ==== CUSTOM CSS FOR ADMIN PAGE ==== -->
<link rel="stylesheet" href="<?= base_url('css/admin.css') ?>">

<main>
    <!-- ==== ADMIN MAIN CONTAINER ==== -->
    <div class="admin-container">

        <!-- ==== PAGE HEADING ==== -->
        <h3>Registered Users</h3>

        <!-- ==== FLASH MESSAGE FOR SUCCESS ==== -->
        <?php if(session()->getFlashdata('success')): ?>
            <div class="alert alert-success text-center">
                <?= session()->getFlashdata('success') ?>
            </div>
        <?php endif; ?>

        <!-- ==== USERS TABLE ==== -->
        <table class="table table-striped table-hover table-bordered">

        
            <!-- ==== TABLE HEADER ==== -->
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th width="120">Action</th>
                </tr>
            </thead>

            <!-- ==== TABLE BODY ==== -->
            <tbody>
                <?php if (!empty($users) && is_array($users)): ?>
                    <?php foreach ($users as $u): ?>
                        <tr>
                            <td><?= esc($u['id']) ?></td>
                            <td><?= esc($u['name']) ?></td>
                            <td><?= esc($u['email']) ?></td>
                            <td><?= esc($u['role']) ?></td>
                            <td>

                                <!-- ==== DELETE BUTTON FOR NON-ADMIN USERS ==== -->
                                <?php if ($u['role'] !== 'admin'): ?>
                                    <a href="<?= base_url('admin/delete/'.$u['id']) ?>"
                                       class="btn btn-danger btn-sm"
                                       onclick="return confirm('Delete this user?')">Delete</a>
                                <?php else: ?>


                                    <!-- ==== NO ACTION FOR ADMIN ==== -->
                                    <span class="text-muted">—</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>


                    <!-- ==== NO USERS FOUND MESSAGE ==== -->
                    <tr>
                        <td colspan="5" class="text-center text-muted">No users found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <!-- ==== PAGINATION LINKS ==== -->
        <div class="d-flex justify-content-center">
            <?= $pager->links('users', 'bootstrap_full') ?>
        </div>

    </div>
</main>

<?= $this->include('templates/footer') ?>
