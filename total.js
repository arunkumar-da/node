const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3007; // Use the desired port for the combined server

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser

// Create connection to the MySQL database for the first database
const dbQuestion = mysql.createConnection({
  host: 'localhost',
  user: 'systemian',
  password: 'systemian',
  database: 'question'
});

dbQuestion.connect((err) => {
  if (err) throw err;
  console.log('Connected to the question database');
});

// Create connection to the MySQL database for the second database
const dbClient = mysql.createConnection({
  host: "localhost",
  user: "systemian",
  password: "systemian",
  database: "client"
});

dbClient.connect((err) => {
  if (err) throw err;
  console.log('Connected to the client database');
});

// Create connection to the MySQL database for the employee database
const dbEmployee = mysql.createConnection({
  host: "localhost",
  user: "systemian",
  password: "systemian",
  database: 'employees'
});

dbEmployee.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the employees database.');
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/resume'); // Save files to 'C:/resume' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Endpoint to fetch data based on role
app.get('/getData', (req, res) => {
  const { role } = req.query; // Extract role from query parameters
  let sql = 'SELECT * FROM question';
  
  // Check if role is provided and not empty
  if (role && role.trim() !== '') {
    sql += ` WHERE role = ?`; // Filter by role if provided
  }
  
  dbQuestion.query(sql, [role], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(results);
  });
});

// Handle form submissions and file upload (POST requests)
app.post('/submit', upload.single('file'), (req, res) => {
  // Extract form data
  const { role, email, phonenumber, skills } = req.body;
  // Insert form data into client database
  const query = 'INSERT INTO customers (role, email, phonenumber, skills) VALUES (?, ?, ?, ?)';
  dbClient.query(query, [role, email, phonenumber, skills], (err, result) => {
    if (err) {
      console.error('Error inserting form data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send('Form submitted successfully');
  });
});

// Login route
app.post('/login', (req, res) => {
  let { email, password } = req.body;

  // Log the received inputs
  console.log(`Received login request: email=${email}, password=${password}`);

  // Convert inputs to strings
  email = String(email);
  password = String(password);

  // Validate inputs
  if (!email || !password) {
    res.status(400).send({ success: false, message: 'Email and password are required' });
    return;
  }

  const query = 'SELECT * FROM employees WHERE email = ? AND password = ?';
  dbEmployee.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error: ', err);  // Log the error details
      res.status(500).send({ success: false, message: 'Database query failed', error: err.message });
    } else {
      // Log the query results
      console.log('Query results: ', results);

      if (results.length > 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false, message: 'Invalid email or password' });
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
