package com.suyog.equipmentfailureprediction.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {

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