# 🎃 La Calaverita de Juan 💀

Juego educativo web sobre el Día de Muertos donde Juan pide calaverita de casa en casa respondiendo preguntas sobre cultura mexicana y leyendas tradicionales.

## 🚀 Instalación Rápida

### 1. Requisitos
- XAMPP (Apache + MySQL + PHP)
- Navegador web moderno

### 2. Configurar XAMPP

1. Instala XAMPP desde [apachefriends.org](https://www.apachefriends.org)
2. Abre el Panel de Control de XAMPP
3. Inicia **Apache** y **MySQL**

### 3. Instalar Base de Datos

1. Copia la carpeta del proyecto a `C:\xampp\htdocs\`
2. Abre en tu navegador: `http://localhost/la_calaverita_de_juan/install_db.php`
3. El instalador creará automáticamente la base de datos

### 4. Jugar

Abre: `http://localhost/la_calaverita_de_juan/public/`

## 🎮 Características

- ⏱️ Temporizador de 1 minuto (modo rápido)
- 🎯 40 preguntas sobre cultura mexicana
- 📖 15 leyendas mexicanas (cada 4 preguntas)
- 💯 Sistema de puntuación con penalización (-5 pts por error)
- 🏆 Ranking top 3 en base de datos MySQL
- 📱 Diseño responsivo y minimalista

## 📁 Estructura

```
la_calaverita_de_juan/
├── public/              # Juego (frontend)
│   ├── index.html       # Página principal
│   ├── style.css        # Estilos minimalistas
│   ├── script.js        # Lógica del juego
│   ├── data/            # Preguntas y leyendas (JSON)
│   └── img/             # Imágenes del juego
├── backend/             # API PHP
│   ├── db_config.php    # Configuración DB
│   ├── save_score.php   # Guardar puntajes
│   └── get_scores.php   # Obtener ranking
├── install_db.php       # Instalador automático
├── test_db.php          # Verificar conexión DB
└── README.md            # Este archivo
```

## 🔧 Configuración

### Base de Datos
- Host: `localhost`
- Usuario: `root`
- Contraseña: `` (vacío por defecto)
- Base de datos: `calaverita_db`

Si necesitas cambiar la configuración, edita `backend/db_config.php`

## 🖼️ Imágenes

Coloca las imágenes en `public/img/`:
- `juan.png` - Personaje principal
- `casa1.png`, `casa2.png`, `casa3.png`, `casa4.png` - Casas
- `llorona.png`, `charro_negro.png`, `nahual.png` - Leyendas

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo en XAMPP
- Ejecuta `install_db.php` para crear la base de datos
- Revisa `test_db.php` para diagnosticar

### Las imágenes no se cargan
- Verifica que estén en `public/img/`
- Revisa que los nombres coincidan exactamente

### Error 403 o 500
- Verifica que Apache esté corriendo
- Los archivos `.htaccess` ya están configurados

## 📝 Personalización

### Agregar más preguntas
Edita `public/data/preguntas.json`:
```json
{
  "id": 41,
  "pregunta": "Tu pregunta aquí",
  "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  "respuesta": 0,
  "puntos": 10
}
```

### Agregar más leyendas
Edita `public/data/leyendas.json` siguiendo el mismo formato.

## 🎨 Tecnologías

- HTML5, CSS3, JavaScript ES6+
- PHP 7.4+
- MySQL 8.0+
- Apache (XAMPP)

## 📄 Licencia

Proyecto educativo de código abierto.

---

¡Disfruta jugando y aprendiendo sobre el Día de Muertos! 🎃💀🌺
