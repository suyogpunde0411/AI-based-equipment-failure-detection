package com.suyog.equipmentfailureprediction.dto.response;

import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {

    private Long predictionId;

    private String equipmentName;

    private Boolean failure;

    private Double probability;

    private Double confidence;

    private Double healthScore;

    private RiskLevel riskLevel;

    private List<String> topFactors;

    private List<String> recommendations;

    private LocalDateTime predictionTime;
}