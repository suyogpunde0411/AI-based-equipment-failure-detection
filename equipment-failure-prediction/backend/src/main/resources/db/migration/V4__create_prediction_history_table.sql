CREATE TABLE prediction_history
(
    id BIGSERIAL PRIMARY KEY,

    equipment_id BIGINT NOT NULL,

    sensor_reading_id BIGINT NOT NULL,

    prediction BOOLEAN NOT NULL,

    probability DOUBLE PRECISION NOT NULL,

    confidence DOUBLE PRECISION NOT NULL,

    health_score DOUBLE PRECISION NOT NULL,

    risk_level VARCHAR(20) NOT NULL,

    model_used VARCHAR(50),

    top_factors TEXT,

    recommendations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_prediction_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(id),

    CONSTRAINT fk_prediction_sensor
        FOREIGN KEY (sensor_reading_id)
        REFERENCES sensor_readings(id)
);