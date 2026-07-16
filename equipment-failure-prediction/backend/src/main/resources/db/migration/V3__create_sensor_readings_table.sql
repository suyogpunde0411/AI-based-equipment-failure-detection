CREATE TABLE sensor_readings
(
    id BIGSERIAL PRIMARY KEY,

    equipment_id BIGINT NOT NULL,

    air_temperature DOUBLE PRECISION NOT NULL,

    process_temperature DOUBLE PRECISION NOT NULL,

    rotational_speed DOUBLE PRECISION NOT NULL,

    torque DOUBLE PRECISION NOT NULL,

    tool_wear DOUBLE PRECISION NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sensor_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(id)
        ON DELETE CASCADE
);