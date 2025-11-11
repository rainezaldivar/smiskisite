<?php namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    // DATABASE TABLE NAME
    protected $table = 'users';

    // PRIMARY KEY
    protected $primaryKey = 'id';

    // FIELDS ALLOWED FOR MASS ASSIGNMENT
    protected $allowedFields = ['name', 'email', 'password', 'role'];

    // AUTOMATIC TIMESTAMPS
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // HOOKS - PASSWORD HASHING BEFORE INSERT AND UPDATE
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    // HASH PASSWORD FUNCTION
    protected function hashPassword(array $data)
    {
        // CHECK IF PASSWORD IS PROVIDED
        if (!empty($data['data']['password'])) {
            $password = $data['data']['password'];

            // HASH PASSWORD IF NOT ALREADY HASHED
            if (strpos($password, '$2y$') !== 0 && strpos($password, '$2a$') !== 0) {
                $data['data']['password'] = password_hash($password, PASSWORD_DEFAULT);
            }
        }

        return $data;
    }
}
