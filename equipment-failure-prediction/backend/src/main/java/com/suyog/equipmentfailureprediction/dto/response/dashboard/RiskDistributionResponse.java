package com.suyog.equipmentfailureprediction.dto.response.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskDistributionResponse {

    private String riskLevel;

    private Long count;

}