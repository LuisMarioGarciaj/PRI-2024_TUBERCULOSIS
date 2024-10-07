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
/* ************************ LOGIN *********************** */
/* ****************************************************** */
// LOGIN O AUTENTICACION DE USUARIOS CON VERIFICACION DE CORREO Y CONTRASEÑA
app.get('/api/login', (req, res) => {
  const { correo, contrasenia } = req.query;
  
  if (!correo || !contrasenia) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const query = `SELECT *
                 FROM persona
                 WHERE estado = 1 AND (correo = ? AND contrasenia = ?);`;

  db.query(query, [correo, contrasenia], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json(result[0]);  // Envia el primer resultado de mi usuario
  });
});

// RUTA PROTEGIDA SOLO PARA ADMINISTRADORES
const verifyRole = (role) => {
  return (req, res, next) => {
    const { correo, contrasenia } = req.query;

    const query = 'SELECT rol FROM persona WHERE correo = ? AND contrasenia = ?';
    db.query(query, [correo, contrasenia], (error, result) => {
      if (error || result.length ===0 || result[0].rol !== role) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      next();
    });
  };
};

app.get('/api/admin-data', verifyRole('administrador'), (req, res) => {
  res.json({ message: 'Datos confidenciales del administrador' });
});


/* ****************************************************** */
/* ********************** PACIENTES ********************* */
/* ****************************************************** */
// PACIENTES 
app.get('/api/pacientes', (req, res) => {
  const query = ` SELECT idPersona, CONCAT(primerNombre, ' ', IFNULL(segundoNombre,''), ' ', primerApellido, ' ', IFNULL(segundoApellido,'')) AS nombreCompleto, CI
                  FROM persona
                  WHERE rol = 'paciente';`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});


/* ****************************************************** */
/* ******************* PERSONAL MÉDICO ****************** */
/* ****************************************************** */
// PERSONAL MEDICO
app.get('/api/medicos', (req, res) => {
  const query = ` SELECT idPersona, CONCAT(primerNombre, ' ', IFNULL(segundoNombre,''), ' ', primerApellido, ' ', IFNULL(segundoApellido,'')) AS nombreCompleto, CI, correo, numeroCelular
                  FROM persona
                  WHERE rol = 'doctor';`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(result);
  });
});



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
