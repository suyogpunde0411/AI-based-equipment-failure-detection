package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;

import java.util.List;

public interface RecommendationService {

    List<String> generateRecommendations(
            PredictionRequest request,
            double probability);

}