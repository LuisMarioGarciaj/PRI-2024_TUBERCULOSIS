// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importar el módulo cors

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Permitir solicitudes desde otros dominios
app.use(express.json()); // Para procesar datos JSON en las solicitudes

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUNGE8H2S1re',  // DEBE CAMBIAR LA CONTRASEÑA
  database: 'tuberculosis',
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


// Rutas
app.get('/api/redsalud', (req, res) => {
  const query = 'SELECT * FROM tuberculosis.redsalud;'; // Asegúrate de que 'foods' sea el nombre correcto de la tabla
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result); // Devuelve los datos en formato JSON
  });
});



/* ****************************************************** */
/* ******************* PERSONAL MÉDICO ****************** */
/* ****************************************************** */
// PERSONAL MEDICO
/*app.get('/api/medicos', (req, res) => {
  const query = ` SELECT idPersona, CONCAT(primerNombre, ' ', IFNULL(segundoNombre,''), ' ', primerApellido, ' ', IFNULL(segundoApellido,'')) AS nombreCompleto, CI, correo, numeroCelular
                  FROM persona
                  WHERE rol = 'doctor';`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});*/



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
