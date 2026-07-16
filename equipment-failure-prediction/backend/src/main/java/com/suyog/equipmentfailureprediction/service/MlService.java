package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.MlPredictionResponse;

public interface MlService {

    MlPredictionResponse predict(PredictionRequest request);

}