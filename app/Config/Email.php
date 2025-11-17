<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    // === SMTP SERVER DETAILS ===
    public $SMTPHost   = 'smtp.gmail.com';
    public $SMTPUser   = 'rainez333@gmail.com';
    public $SMTPPass   = '[you 16 app passcode from google]';
    public $SMTPPort   = 465;

    public $SMTPCrypto = 'ssl';

    // === GENERAL EMAIL SEND SETTINGS ===
    public $protocol = 'smtp';
    public $mailType = 'html';
    public $charset  = 'utf-8';
    public $newline  = "\r\n";
}

