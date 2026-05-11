CREATE DATABASE parkingdb;
USE parkingdb;

CREATE TABLE api_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    kyc_verified BOOLEAN DEFAULT FALSE,
    reset_otp VARCHAR(6),
    reset_otp_created_at DATETIME,

    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE TABLE api_parkinglot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(255),
    total_slots INT
);

CREATE TABLE api_zone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    lot_id INT,

    FOREIGN KEY (lot_id) REFERENCES api_parkinglot(id) ON DELETE CASCADE
); 

CREATE TABLE api_slot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE,
    type VARCHAR(20),
    is_reserved BOOLEAN DEFAULT FALSE,
    is_occupied BOOLEAN DEFAULT FALSE,
    zone_id INT,
    x FLOAT,
    y FLOAT,

    FOREIGN KEY (zone_id) REFERENCES api_zone(id) ON DELETE CASCADE
); 

CREATE TABLE api_vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plate VARCHAR(20),
    type VARCHAR(20),

    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
); 

CREATE TABLE api_reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,
    start_time DATETIME,
    end_time DATETIME,
    price FLOAT,
    status VARCHAR(20) DEFAULT 'active',

    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (slot_id) REFERENCES api_slot(id)
);

CREATE TABLE api_session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,

    entry_time DATETIME,
    exit_time DATETIME,

    charges DECIMAL(10,2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (slot_id) REFERENCES api_slot(id)
); 

CREATE TABLE api_payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id INT,

    amount DECIMAL(10,2),

    method ENUM('WALLET','UPI','CARD'),
    status VARCHAR(20),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (session_id) REFERENCES api_session(id)
); 

CREATE TABLE api_booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,
    booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),

    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (slot_id) REFERENCES api_slot(id)
); 
DROP TABLE api_booking;

CREATE INDEX idx_reservation_user ON api_reservation(user_id);
CREATE INDEX idx_reservation_slot ON api_reservation(slot_id);

CREATE TABLE api_violation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    type VARCHAR(100),
    fine FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vehicle_id) REFERENCES api_vehicle(id)
); 

CREATE TABLE api_vehicleposition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    x FLOAT,
    y FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vehicle_id) REFERENCES api_vehicle(id)
); 

CREATE TABLE api_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id INT,
    status BOOLEAN,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (slot_id) REFERENCES api_slot(id)
);

CREATE TABLE api_event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM auth_user;