<<<<<<< HEAD
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// 1. Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    await connection.end();
    res.json({ status: "Success", message: "Backend & Database Connected!", data: rows });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 2. GET: Fetch All 57 Services
app.get('/api/services', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [services] = await connection.query('SELECT * FROM services ORDER BY category, service_name');
    await connection.end();
    res.json({ status: "Success", count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 3. POST: Book an Appointment
app.post('/api/appointments', async (req, res) => {
  const { name, phone, email, service_id, appointment_date } = req.body;

  if (!name || !phone || !service_id || !appointment_date) {
    return res.status(400).json({ 
      status: "Error", 
      message: "Please provide name, phone, service_id, and appointment_date." 
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let [users] = await connection.query('SELECT id FROM users WHERE phone = ?', [phone]);
    let userId;

    if (users.length > 0) {
      userId = users[0].id;
    } else {
      const [newUser] = await connection.query(
        'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email || null]
      );
      userId = newUser.insertId;
    }

    const [appointment] = await connection.query(
      'INSERT INTO appointments (user_id, service_id, appointment_date) VALUES (?, ?, ?)',
      [userId, service_id, appointment_date]
    );

    await connection.end();

    res.status(201).json({
      status: "Success",
      message: "Appointment booked successfully!",
      appointment_id: appointment.insertId
    });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 4. GET: View Appointments (Admin)
app.get('/api/appointments', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT 
        a.id AS appointment_id,
        u.name AS client_name,
        u.phone AS client_phone,
        s.service_name,
        s.price,
        a.appointment_date,
        a.status
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC;
    `;
    const [appointments] = await connection.query(query);
    await connection.end();

    res.json({ status: "Success", count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
=======
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// 1. Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    await connection.end();
    res.json({ status: "Success", message: "Backend & Database Connected!", data: rows });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 2. GET: Fetch All 57 Services
app.get('/api/services', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [services] = await connection.query('SELECT * FROM services ORDER BY category, service_name');
    await connection.end();
    res.json({ status: "Success", count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 3. POST: Book an Appointment
app.post('/api/appointments', async (req, res) => {
  const { name, phone, email, service_id, appointment_date } = req.body;

  if (!name || !phone || !service_id || !appointment_date) {
    return res.status(400).json({ 
      status: "Error", 
      message: "Please provide name, phone, service_id, and appointment_date." 
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let [users] = await connection.query('SELECT id FROM users WHERE phone = ?', [phone]);
    let userId;

    if (users.length > 0) {
      userId = users[0].id;
    } else {
      const [newUser] = await connection.query(
        'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email || null]
      );
      userId = newUser.insertId;
    }

    const [appointment] = await connection.query(
      'INSERT INTO appointments (user_id, service_id, appointment_date) VALUES (?, ?, ?)',
      [userId, service_id, appointment_date]
    );

    await connection.end();

    res.status(201).json({
      status: "Success",
      message: "Appointment booked successfully!",
      appointment_id: appointment.insertId
    });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// 4. GET: View Appointments (Admin)
app.get('/api/appointments', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT 
        a.id AS appointment_id,
        u.name AS client_name,
        u.phone AS client_phone,
        s.service_name,
        s.price,
        a.appointment_date,
        a.status
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC;
    `;
    const [appointments] = await connection.query(query);
    await connection.end();

    res.json({ status: "Success", count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
>>>>>>> b4601a0584d33d907383d5d0562baf9c12a5fceb
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));