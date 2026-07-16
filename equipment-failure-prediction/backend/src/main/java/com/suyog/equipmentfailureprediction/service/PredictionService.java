package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.PredictionResponse;

public interface PredictionService {

    PredictionResponse predict(PredictionRequest request);

}