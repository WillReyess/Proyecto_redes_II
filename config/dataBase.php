<?php
class Database {
    private $host = "localhost";
    private $dbname = "users";
    private $username = "root";
    private $password = "";
    public $conn;

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
