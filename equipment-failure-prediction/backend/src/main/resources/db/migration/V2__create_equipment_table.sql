CREATE TABLE equipment (
    id BIGSERIAL PRIMARY KEY,

    equipment_code VARCHAR(50) UNIQUE NOT NULL,

    machine_name VARCHAR(100) NOT NULL,

    machine_type VARCHAR(100) NOT NULL,

    manufacturer VARCHAR(100),

    location VARCHAR(100),

    installation_date DATE,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);