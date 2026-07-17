package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.MlPredictionResponse;
import com.suyog.equipmentfailureprediction.dto.response.PredictionResponse;
import com.suyog.equipmentfailureprediction.entity.Equipment;
import com.suyog.equipmentfailureprediction.entity.PredictionHistory;
import com.suyog.equipmentfailureprediction.entity.SensorReading;
import com.suyog.equipmentfailureprediction.enums.EquipmentStatus;
import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import com.suyog.equipmentfailureprediction.exception.ResourceNotFoundException;
import com.suyog.equipmentfailureprediction.repository.EquipmentRepository;
import com.suyog.equipmentfailureprediction.repository.PredictionHistoryRepository;
import com.suyog.equipmentfailureprediction.repository.SensorReadingRepository;
import com.suyog.equipmentfailureprediction.service.MlService;
import com.suyog.equipmentfailureprediction.service.PredictionService;
import com.suyog.equipmentfailureprediction.service.RecommendationService;
import com.suyog.equipmentfailureprediction.util.HealthScoreCalculator;
import com.suyog.equipmentfailureprediction.util.RiskLevelCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PredictionServiceImpl implements PredictionService {

    private final EquipmentRepository equipmentRepository;

    private final SensorReadingRepository sensorReadingRepository;

    private final PredictionHistoryRepository predictionHistoryRepository;

    private final MlService mlService;

    private final RecommendationService recommendationService;

    @Override
    public PredictionResponse predict(PredictionRequest request) {

        Equipment equipment = findEquipment(request.getEquipmentId());

        SensorReading sensorReading = saveSensorReading(request, equipment);

        MlPredictionResponse mlResponse = mlService.predict(request);

        double healthScore =
                HealthScoreCalculator.calculate(
                        mlResponse.getProbability());

        RiskLevel riskLevel =
                RiskLevelCalculator.calculate(
                        mlResponse.getProbability());

        List<String> recommendations =
                recommendationService.generateRecommendations(
                        request,
                        mlResponse.getProbability());

        if (mlResponse.getFailure() || riskLevel == RiskLevel.HIGH || riskLevel == RiskLevel.CRITICAL) {
            equipment.setStatus(EquipmentStatus.MAINTENANCE);
            equipmentRepository.save(equipment);
        } else if (equipment.getStatus() == EquipmentStatus.MAINTENANCE) {
            equipment.setStatus(EquipmentStatus.RUNNING);
            equipmentRepository.save(equipment);
        }

        PredictionHistory history =
                savePredictionHistory(
                        equipment,
                        sensorReading,
                        mlResponse,
                        healthScore,
                        riskLevel
                );

        return buildResponse(
                history,
                equipment,
                mlResponse,
                healthScore,
                riskLevel,
                recommendations
        );

    }

    private Equipment findEquipment(Long equipmentId) {

        return equipmentRepository.findById(equipmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with id : "
                                        + equipmentId));

    }

    private SensorReading saveSensorReading(
            PredictionRequest request,
            Equipment equipment) {

        SensorReading sensorReading =
                SensorReading.builder()
                        .equipment(equipment)
                        .airTemperature(request.getAirTemperature())
                        .processTemperature(request.getProcessTemperature())
                        .rotationalSpeed(request.getRotationalSpeed())
                        .torque(request.getTorque())
                        .toolWear(request.getToolWear())
                        .createdAt(LocalDateTime.now())
                        .build();

        return sensorReadingRepository.save(sensorReading);

    }

    private PredictionHistory savePredictionHistory(
            Equipment equipment,
            SensorReading sensorReading,
            MlPredictionResponse mlResponse,
            double healthScore,
            RiskLevel riskLevel) {

        PredictionHistory history = PredictionHistory.builder()
                .equipment(equipment)
                .sensorReading(sensorReading)
                .prediction(mlResponse.getFailure())
                .probability(mlResponse.getProbability())
                .confidence(mlResponse.getConfidence())
                .healthScore(healthScore)
                .riskLevel(riskLevel)
                .modelUsed("Random Forest")
                .createdAt(LocalDateTime.now())
                .build();

        return predictionHistoryRepository.save(history);

    }

    private PredictionResponse buildResponse(
            PredictionHistory history,
            Equipment equipment,
            MlPredictionResponse mlResponse,
            double healthScore,
            RiskLevel riskLevel,
            List<String> recommendations) {

        return PredictionResponse.builder()
                .predictionId(history.getId())
                .equipmentName(equipment.getMachineName())
                .failure(mlResponse.getFailure())
                .probability(mlResponse.getProbability())
                .confidence(mlResponse.getConfidence())
                .healthScore(healthScore)
                .riskLevel(riskLevel)
                .topFactors(mlResponse.getTopFactors())
                .recommendations(recommendations)
                .predictionTime(history.getCreatedAt())
                .build();

    }

}