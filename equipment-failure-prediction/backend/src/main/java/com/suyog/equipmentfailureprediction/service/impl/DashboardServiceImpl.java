package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.response.dashboard.DashboardResponse;
import com.suyog.equipmentfailureprediction.dto.response.dashboard.RecentPredictionResponse;
import com.suyog.equipmentfailureprediction.dto.response.dashboard.RiskDistributionResponse;
import com.suyog.equipmentfailureprediction.entity.PredictionHistory;
import com.suyog.equipmentfailureprediction.enums.EquipmentStatus;
import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import com.suyog.equipmentfailureprediction.repository.EquipmentRepository;
import com.suyog.equipmentfailureprediction.repository.PredictionHistoryRepository;
import com.suyog.equipmentfailureprediction.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class DashboardServiceImpl implements DashboardService {

    private final EquipmentRepository equipmentRepository;

    private final PredictionHistoryRepository predictionHistoryRepository;

    @Override
    public DashboardResponse getDashboard() {

        Long totalEquipment = equipmentRepository.count();

        Long healthyEquipment =
                equipmentRepository.countByStatus(
                        EquipmentStatus.RUNNING);

        Long criticalEquipment =
                predictionHistoryRepository.countByRiskLevel(RiskLevel.CRITICAL) +
                predictionHistoryRepository.countByRiskLevel(RiskLevel.HIGH);

        Double averageHealthScore =
                predictionHistoryRepository.getAverageHealthScore();

        if (averageHealthScore == null)
            averageHealthScore = 0.0;

        List<PredictionHistory> history =
                predictionHistoryRepository
                        .findTop10ByOrderByCreatedAtDesc();

        List<RecentPredictionResponse> recentPredictions =
                new ArrayList<>();

        for (PredictionHistory prediction : history) {

            recentPredictions.add(

                    RecentPredictionResponse.builder()

                            .machineName(
                                    prediction.getEquipment()
                                            .getMachineName())

                            .probability(
                                    prediction.getProbability())

                            .healthScore(
                                    prediction.getHealthScore())

                            .riskLevel(
                                    prediction.getRiskLevel().name())

                            .build()

            );

        }

        List<RiskDistributionResponse> riskDistribution =
                new ArrayList<>();

        for (RiskLevel level : RiskLevel.values()) {

            riskDistribution.add(

                    RiskDistributionResponse.builder()

                            .riskLevel(level.name())

                            .count(
                                    predictionHistoryRepository
                                            .countByRiskLevel(level))

                            .build()

            );

        }

        return DashboardResponse.builder()

                .totalEquipment(totalEquipment)

                .healthyEquipment(healthyEquipment)

                .criticalEquipment(criticalEquipment)

                .averageHealthScore(averageHealthScore)

                .recentPredictions(recentPredictions)

                .riskDistribution(riskDistribution)

                .build();

    }

}