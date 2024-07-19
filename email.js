const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'arunkumar8667673544@gmail.com', // Replace with your Gmail address
        pass: 'hnwjrzeshayjujen' // Replace with your Gmail password or App Specific Password

    }
});

// Route to handle sending warning email
app.post('/sendWarningEmail', async (req, res) => {
    const { name } = req.body;

    // Email content
    const mailOptions = {
        from: 'arunkumar8667673544@gmail.com',
        to: 'arunkumarv.ug20.cs@francisxavier.ac.in',

        subject: 'Warning: Action Required',
        text: `Dear recipient,\n\nThis is a warning message regarding ${name}. Please take appropriate action.\n\nRegards,\nYour Name`
    };

    try {
        // Sending email
        await transporter.sendMail(mailOptions);
        console.log('Warning email sent successfully');
        res.status(200).send('Email sent successfully');  // Respond to frontend
    } catch (error) {
        console.error('Error sending warning email:', error.message);
        res.status(500).send('Failed to send email');  // Respond to frontend with error
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
