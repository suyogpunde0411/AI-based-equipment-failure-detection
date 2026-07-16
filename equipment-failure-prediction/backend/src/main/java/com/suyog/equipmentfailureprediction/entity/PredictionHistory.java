package com.suyog.equipmentfailureprediction.entity;

import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_reading_id")
    private SensorReading sensorReading;

    private Boolean prediction;

    private Double probability;

    private Double confidence;

    @Column(name = "health_score")
    private Double healthScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    @Column(name = "model_used")
    private String modelUsed;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}