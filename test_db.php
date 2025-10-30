<?php
// Script de prueba de conexión a la base de datos

echo "<h1>Test de Conexión - La Calaverita de Juan</h1>";

// Configuración
$host = 'localhost';
$dbname = 'calaverita_db';
$username = 'root';
$password = '';

echo "<h2>1. Probando conexión a MySQL...</h2>";

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Conexión a MySQL exitosa<br>";
    
    // Verificar si existe la base de datos
    echo "<h2>2. Verificando base de datos 'calaverita_db'...</h2>";
    $stmt = $pdo->query("SHOW DATABASES LIKE 'calaverita_db'");
    $db_exists = $stmt->fetch();
    
    if ($db_exists) {
        echo "✅ Base de datos 'calaverita_db' existe<br>";
        
        // Conectar a la base de datos
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Verificar tabla
        echo "<h2>3. Verificando tabla 'puntajes'...</h2>";
        $stmt = $pdo->query("SHOW TABLES LIKE 'puntajes'");
        $table_exists = $stmt->fetch();
        
        if ($table_exists) {
            echo "✅ Tabla 'puntajes' existe<br>";
            
            // Contar registros
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM puntajes");
            $result = $stmt->fetch();
            echo "📊 Registros en la tabla: " . $result['total'] . "<br>";
            
            // Mostrar últimos 5 puntajes
            echo "<h2>4. Últimos puntajes registrados:</h2>";
            $stmt = $pdo->query("SELECT nombre, puntos, fecha FROM puntajes ORDER BY fecha DESC LIMIT 5");
            $scores = $stmt->fetchAll();
            
            if (count($scores) > 0) {
                echo "<table border='1' cellpadding='10'>";
                echo "<tr><th>Nombre</th><th>Puntos</th><th>Fecha</th></tr>";
                foreach ($scores as $score) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($score['nombre']) . "</td>";
                    echo "<td>" . $score['puntos'] . "</td>";
                    echo "<td>" . $score['fecha'] . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "ℹ️ No hay puntajes registrados aún<br>";
            }
            
            echo "<h2>✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE</h2>";
            echo "<p><a href='public/index.html'>🎮 Ir al juego</a></p>";
            
        } else {
            echo "❌ Tabla 'puntajes' NO existe<br>";
            echo "<h3>Ejecuta este SQL en phpMyAdmin:</h3>";
            echo "<pre>";
            echo "CREATE TABLE puntajes (\n";
            echo "    id INT AUTO_INCREMENT PRIMARY KEY,\n";
            echo "    nombre VARCHAR(50) NOT NULL,\n";
            echo "    puntos INT NOT NULL,\n";
            echo "    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n";
            echo ");";
            echo "</pre>";
        }
        
    } else {
        echo "❌ Base de datos 'calaverita_db' NO existe<br>";
        echo "<h3>Ejecuta este SQL en phpMyAdmin:</h3>";
        echo "<pre>";
        echo "CREATE DATABASE calaverita_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n";
        echo "USE calaverita_db;\n";
        echo "CREATE TABLE puntajes (\n";
        echo "    id INT AUTO_INCREMENT PRIMARY KEY,\n";
        echo "    nombre VARCHAR(50) NOT NULL,\n";
        echo "    puntos INT NOT NULL,\n";
        echo "    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n";
        echo ");";
        echo "</pre>";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    echo "<h3>Posibles soluciones:</h3>";
    echo "<ul>";
    echo "<li>Verifica que MySQL esté corriendo en XAMPP</li>";
    echo "<li>Verifica el usuario y contraseña en backend/db_config.php</li>";
    echo "<li>Asegúrate de que el puerto 3306 esté disponible</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<h2>Información del Sistema:</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Ruta del proyecto: " . __DIR__ . "<br>";
?>
