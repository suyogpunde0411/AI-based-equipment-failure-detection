package com.suyog.equipmentfailureprediction.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SensorReadingResponse {

    private Long id;

    private Long equipmentId;

    private Double airTemperature;

    private Double processTemperature;

    private Double rotationalSpeed;

    private Double torque;

    private Double toolWear;

    private LocalDateTime createdAt;
}