const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// All services extracted from owner's rate list
const servicesData = [
  // --- THREADING, BLEACH & FACIALS ---
  { name: 'Glow Bleach', category: 'Bleach & Facials', price: 350, duration: 30 },
  { name: 'Herbal Facial', category: 'Bleach & Facials', price: 600, duration: 45 },
  { name: 'Fruit Facial', category: 'Bleach & Facials', price: 700, duration: 45 },
  { name: 'D-Tan Facial', category: 'Bleach & Facials', price: 1000, duration: 60 },
  { name: 'Hydra Facial', category: 'Bleach & Facials', price: 1800, duration: 60 },
  { name: 'Platinum Facial', category: 'Bleach & Facials', price: 1000, duration: 60 },
  { name: 'Silver Facial', category: 'Bleach & Facials', price: 1000, duration: 60 },
  { name: 'Gold Facial', category: 'Bleach & Facials', price: 1000, duration: 60 },
  { name: 'O3+ Facial', category: 'Bleach & Facials', price: 1500, duration: 60 },
  { name: 'Diamond Facial', category: 'Bleach & Facials', price: 1000, duration: 60 },

  // --- ADVANCED FACIALS & SKIN TREATMENTS ---
  { name: 'Microdermabrasion', category: 'Advanced Skin Treatments', price: 1500, duration: 60 },
  { name: 'Collagen Booster Facial', category: 'Advanced Skin Treatments', price: 2000, duration: 60 },
  { name: 'Glutaglow Treatment', category: 'Advanced Skin Treatments', price: 2000, duration: 60 },
  { name: 'Acne Treatment', category: 'Advanced Skin Treatments', price: 1000, duration: 45 },
  { name: 'Pigmentation Treatment', category: 'Advanced Skin Treatments', price: 1500, duration: 45 },
  { name: 'Acne & Pigmentation Basic', category: 'Advanced Skin Treatments', price: 999, duration: 45 },
  { name: 'Tan Removal', category: 'Advanced Skin Treatments', price: 350, duration: 30 },
  { name: 'Chemical Peels', category: 'Advanced Skin Treatments', price: 1000, duration: 45 },
  { name: 'Glutathione Whitening Treatment', category: 'Advanced Skin Treatments', price: 1999, duration: 60 },
  { name: 'Karbon Facial (Laser)', category: 'Advanced Skin Treatments', price: 2000, duration: 60 },
  { name: 'Tattoo Removal (Per Sitting)', category: 'Advanced Skin Treatments', price: 3000, duration: 60 },

  // --- HAIR CARE & STYLING ---
  { name: 'Hair Cut (Basic to Advance)', category: 'Hair Care', price: 200, duration: 30 },
  { name: 'Layer Cut', category: 'Hair Care', price: 400, duration: 45 },
  { name: 'Hair Spa (Colored Hair)', category: 'Hair Care', price: 700, duration: 60 },
  { name: 'Hair Spa (Rough & Dry Hair)', category: 'Hair Care', price: 900, duration: 60 },
  { name: 'Dandruff & Hairfall Treatment', category: 'Hair Care', price: 1300, duration: 60 },

  // --- HAIR TREATMENTS & COLORING ---
  { name: 'Hair Smoothing', category: 'Hair Treatments', price: 3000, duration: 120 },
  { name: 'Hair Nanoplastia', category: 'Hair Treatments', price: 3000, duration: 120 },
  { name: 'Blue Plastia', category: 'Hair Treatments', price: 3000, duration: 120 },
  { name: 'Hair Botox', category: 'Hair Treatments', price: 3000, duration: 120 },
  { name: 'Hair Rebonding', category: 'Hair Treatments', price: 3000, duration: 120 },
  { name: 'Root Touchup', category: 'Hair Treatments', price: 800, duration: 45 },
  { name: 'Hair Highlights', category: 'Hair Treatments', price: 2500, duration: 90 },
  { name: 'Ombre Technique Color', category: 'Hair Treatments', price: 4000, duration: 120 },
  { name: 'Balayage Technique Color', category: 'Hair Treatments', price: 4000, duration: 120 },
  { name: 'Global Hair Color', category: 'Hair Treatments', price: 2500, duration: 90 },
  { name: 'Hair Extension', category: 'Hair Treatments', price: 20000, duration: 180 },
  { name: 'Wigs for Men', category: 'Hair Treatments', price: 15000, duration: 90 },

  // --- WAXING ---
  { name: 'Normal Wax (Full)', category: 'Waxing', price: 600, duration: 45 },
  { name: 'Rica Wax (Full)', category: 'Waxing', price: 950, duration: 45 },
  { name: 'Cartridge Wax (Full)', category: 'Waxing', price: 1100, duration: 45 },

  // --- MANICURE, PEDICURE & BODY SPA ---
  { name: 'Normal Pedicure', category: 'Hands & Feet', price: 350, duration: 45 },
  { name: 'Pedicure with Bleach', category: 'Hands & Feet', price: 450, duration: 50 },
  { name: 'Spa Pedicure', category: 'Hands & Feet', price: 800, duration: 60 },
  { name: 'Spa Manicure', category: 'Hands & Feet', price: 500, duration: 45 },
  { name: 'Body Massage', category: 'Spa & Body Care', price: 1000, duration: 60 },
  { name: 'Head Massage', category: 'Spa & Body Care', price: 350, duration: 30 },
  { name: 'Body Polishing', category: 'Spa & Body Care', price: 4000, duration: 90 },

  // --- MAKEUP & BRIDAL ---
  { name: 'Eyebrow Lash Extension', category: 'Makeup & Aesthetic', price: 1500, duration: 60 },
  { name: 'Microblading', category: 'Makeup & Aesthetic', price: 5000, duration: 90 },
  { name: 'Permanent Eyebrows', category: 'Makeup & Aesthetic', price: 5000, duration: 90 },
  { name: 'Lip Pigmentation', category: 'Makeup & Aesthetic', price: 15000, duration: 120 },
  { name: 'Corporate Makeup', category: 'Makeup & Aesthetic', price: 1000, duration: 60 },
  { name: 'Party Makeup', category: 'Makeup & Aesthetic', price: 1500, duration: 60 },
  { name: 'Sider Makeup', category: 'Makeup & Aesthetic', price: 1500, duration: 60 },
  { name: 'Bridal Makeup', category: 'Makeup & Aesthetic', price: 15000, duration: 180 },
  { name: 'Bridal Package', category: 'Makeup & Aesthetic', price: 5000, duration: 120 }
];

async function initializeTables() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Delete old tables so they can be re-created with the right structure
    await connection.query(`DROP TABLE IF EXISTS appointments;`);
    await connection.query(`DROP TABLE IF EXISTS services;`);
    await connection.query(`DROP TABLE IF EXISTS users;`);

    // 1. Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        duration_minutes INT DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Appointments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        service_id INT,
        appointment_date DATETIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert all services
    for (const service of servicesData) {
      await connection.query(
        `INSERT INTO services (service_name, category, price, duration_minutes) VALUES (?, ?, ?, ?)`,
        [service.name, service.category, service.price, service.duration]
      );
    }

    console.log(`Successfully initialized DB and added ${servicesData.length} parlor services!`);
    await connection.end();
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
}

initializeTables();