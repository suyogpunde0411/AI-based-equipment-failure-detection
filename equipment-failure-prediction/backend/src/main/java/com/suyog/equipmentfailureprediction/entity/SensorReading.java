package com.suyog.equipmentfailureprediction.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "air_temperature", nullable = false)
    private Double airTemperature;

    @Column(name = "process_temperature", nullable = false)
    private Double processTemperature;

    @Column(name = "rotational_speed", nullable = false)
    private Double rotationalSpeed;

    @Column(nullable = false)
    private Double torque;

    @Column(name = "tool_wear", nullable = false)
    private Double toolWear;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}