package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.PredictionResponse;
import com.suyog.equipmentfailureprediction.repository.EquipmentRepository;
import com.suyog.equipmentfailureprediction.repository.PredictionHistoryRepository;
import com.suyog.equipmentfailureprediction.repository.SensorReadingRepository;
import com.suyog.equipmentfailureprediction.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PredictionServiceImpl
        implements PredictionService {

    private final EquipmentRepository equipmentRepository;

    private final SensorReadingRepository sensorRepository;

    private final PredictionHistoryRepository predictionRepository;

    @Override
    public PredictionResponse predict(
            PredictionRequest request) {

        return null;
    }

}