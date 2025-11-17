<?php namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    // ==== DATABASE TABLE NAME ====
    protected $table = 'users';

    // ==== PRIMARY KEY ====
    protected $primaryKey = 'id';

    // ==== FIELDS ALLOWED FOR MASS ASSIGNMENT ====
    protected $allowedFields = [
        'name',            // ==== USER NAME ====
        'email',           // ==== USER EMAIL ====
        'password',        // ==== USER PASSWORD ====
        'role',            // ==== USER ROLE (ADMIN OR CUSTOMER) ====
        'profile_picture'  // ==== USER PROFILE PICTURE ====
    ];

    // ==== USE CREATED AND UPDATED TIMESTAMPS ====
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ==== HASH PASSWORD BEFORE INSERT OR UPDATE ====
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    // ==== FUNCTION TO HASH PASSWORD ====
    protected function hashPassword(array $data)
    {
        if (!empty($data['data']['password'])) {
            $password = $data['data']['password'];

            // ==== CHECK IF PASSWORD IS ALREADY HASHED ====
            if (strpos($password, '$2y$') !== 0 && strpos($password, '$2a$') !== 0) {
                $data['data']['password'] = password_hash($password, PASSWORD_DEFAULT);
            }
        }

        return $data;
    }
}
