<?= $this->include('templates/header') ?>

<h3 class="mb-4">Admin Dashboard</h3>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">Registered Users</h5>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach($users as $user): ?>
        <tr>
          <td><?= $user['id'] ?></td>
          <td><?= $user['name'] ?></td>
          <td><?= $user['email'] ?></td>
          <td><?= ucfirst($user['role']) ?></td>
          <td>
            <?php if($user['role'] != 'admin'): ?>
              <a href="/admin/delete/<?= $user['id'] ?>" class="btn btn-sm btn-danger"
                onclick="return confirm('Are you sure you want to delete this user?')">Delete</a>
            <?php else: ?>
              <span class="text-muted">Admin</span>
            <?php endif; ?>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?= $this->include('templates/footer') ?>
