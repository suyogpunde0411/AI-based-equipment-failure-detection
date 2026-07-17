package com.suyog.equipmentfailureprediction.dto.response.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentPredictionResponse {

    private String machineName;

    private Double probability;

    private Double healthScore;

    private String riskLevel;

}