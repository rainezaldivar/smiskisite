<?php namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';

    // ISINAMA KO NA LAHAT NG FIELDS PARA GUMANA PATI ANG PROFILE DETAILS FORM
    protected $allowedFields = [
        'name',            
        'email',           
        'password',        
        'role',            
        'profile_picture', 
        'phone',
        'gender',
        'dob',
        'address',
        'city',
        'province'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (!empty($data['data']['password'])) {
            $password = $data['data']['password'];

            if (strpos($password, '$2y$') !== 0 && strpos($password, '$2a$') !== 0) {
                $data['data']['password'] = password_hash($password, PASSWORD_DEFAULT);
            }
        }
        return $data;
    }
}