const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3008;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "systemian",
  password: "systemian",
  database: 'employees'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM employees WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error: ', err);  // Log the error details
      res.status(500).send({ success: false, message: 'Database query failed', error: err.message });
    } else if (results.length > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false, message: 'Invalid email or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
