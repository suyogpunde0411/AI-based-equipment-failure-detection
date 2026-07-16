package com.suyog.equipmentfailureprediction.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SensorReadingRequest {

    @NotNull
    private Long equipmentId;

    @NotNull
    private Double airTemperature;

    @NotNull
    private Double processTemperature;

    @NotNull
    private Double rotationalSpeed;

    @NotNull
    private Double torque;

    @NotNull
    private Double toolWear;
}