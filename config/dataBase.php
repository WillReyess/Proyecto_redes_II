<?php
require_once __DIR__ . '/../vendor/autoload.php'; 

use Dotenv\Dotenv;

class Database {
    private $host;
    private $username;
    private $password;
    private $dbname;
    public $conn;

    public function __construct() {
        // Cargar las variables de entorno desde el archivo .env ubicado en la raíz del proyecto
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();

        $this->host = $_ENV['DB_HOST'];
        $this->username = $_ENV['DB_USERNAME'];
        $this->password = $_ENV['DB_PASSWORD'];
        $this->dbname = $_ENV['DB_NAME'];
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->dbname);
            $this->conn->set_charset("utf8");
            if ($this->conn->connect_error) {
                throw new Exception("Error de conexión: " . $this->conn->connect_error);
            }
        } catch (Exception $exception) {
            die($exception->getMessage());
        }
        return $this->conn;
    }
}
?>
