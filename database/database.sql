-- AJK Real Estate — Complete Database
-- Run in phpMyAdmin SQL tab

CREATE DATABASE IF NOT EXISTS ajkrealstate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ajkrealstate;

DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS properties;

CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purpose VARCHAR(20) NOT NULL DEFAULT 'sale',
    type VARCHAR(50) NOT NULL DEFAULT 'Residential',
    title VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(150) DEFAULT '',
    size VARCHAR(80) DEFAULT '',
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    beds VARCHAR(20) DEFAULT '',
    baths VARCHAR(20) DEFAULT '',
    `condition` VARCHAR(50) DEFAULT '',
    description TEXT DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    images JSON DEFAULT (JSON_ARRAY()),
    owner_type VARCHAR(20) DEFAULT '',
    owner_name VARCHAR(150) DEFAULT '',
    owner_phone VARCHAR(30) DEFAULT '',
    owner_cnic VARCHAR(20) DEFAULT '',
    owner_fname VARCHAR(150) DEFAULT '',
    owner_wa VARCHAR(30) DEFAULT '',
    owner_dob DATE DEFAULT NULL,
    owner_addr TEXT DEFAULT '',
    agency_name VARCHAR(150) DEFAULT '',
    license_no VARCHAR(60) DEFAULT '',
    office_addr TEXT DEFAULT '',
    experience_years INT DEFAULT NULL,
    email VARCHAR(150) DEFAULT '',
    fard_number VARCHAR(60) DEFAULT '',
    ownership_since VARCHAR(40) DEFAULT '',
    mutation_no VARCHAR(60) DEFAULT '',
    company_name VARCHAR(150) DEFAULT '',
    ntn VARCHAR(40) DEFAULT '',
    secp_no VARCHAR(40) DEFAULT '',
    years_in_business INT DEFAULT NULL,
    website VARCHAR(200) DEFAULT '',
    notes TEXT DEFAULT '',
    status VARCHAR(30) DEFAULT 'Available',
    views INT DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_purpose (purpose),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_featured (featured),
    FULLTEXT idx_search (title, description, owner_name, city, locality)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) DEFAULT '',
    property_id INT DEFAULT NULL,
    property_ref VARCHAR(255) DEFAULT '',
    appt_date DATE NOT NULL,
    appt_time VARCHAR(20) DEFAULT '',
    status VARCHAR(30) DEFAULT 'Pending',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    type VARCHAR(50) DEFAULT '',
    purpose VARCHAR(20) DEFAULT '',
    budget INT DEFAULT NULL,
    message TEXT DEFAULT '',
    property_id INT DEFAULT NULL,
    status VARCHAR(30) DEFAULT 'New',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO properties (purpose,type,title,city,locality,size,price,beds,baths,`condition`,description,owner_type,owner_name,owner_phone,owner_wa,email,status,featured)
VALUES
('sale','Residential','4 Marla House in F-6 Muzaffarabad','Muzaffarabad','F-6 Block','4 Marla',4500000,'3','2','Good','Newly built double storey house with all modern facilities.','owner','Muhammad Arif','0333-1234567','0333-1234567','arif@example.com','Available',1),
('rent','Commercial','Commercial Shop in City Centre','Mirpur','City Centre','200 Sqft',25000,'0','1','Excellent','Prime location commercial shop ideal for retail.','agent','Ahmed Khan','0300-9876543','0300-9876543','ahmed@agency.pk','Available',0),
('sale','Agricultural','10 Kanal Farm Land near River','Bagh','Dhirkot Road','10 Kanal',8000000,'0','0','As-Is','Fertile agricultural land with water access.','owner','Ali Hassan','0345-5555555','0345-5555555','','Available',0);
