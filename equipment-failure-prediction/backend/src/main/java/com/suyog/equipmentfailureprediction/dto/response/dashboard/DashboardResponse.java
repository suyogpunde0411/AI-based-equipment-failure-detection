package com.suyog.equipmentfailureprediction.dto.response.dashboard;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalEquipment;

    private Long healthyEquipment;

    private Long criticalEquipment;

    private Double averageHealthScore;

    private List<RecentPredictionResponse> recentPredictions;

    private List<RiskDistributionResponse> riskDistribution;

}