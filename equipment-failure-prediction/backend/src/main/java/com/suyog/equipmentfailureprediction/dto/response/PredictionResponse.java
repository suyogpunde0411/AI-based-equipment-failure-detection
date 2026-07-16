package com.suyog.equipmentfailureprediction.dto.response;

import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PredictionResponse {

    private Boolean failure;

    private Double probability;

    private Double confidence;

    private Double healthScore;

    private RiskLevel riskLevel;

    private List<String> recommendations;

    private List<String> topFactors;

}