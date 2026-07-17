package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.service.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationServiceImpl
        implements RecommendationService {

    @Override
    public List<String> generateRecommendations(
            PredictionRequest request,
            double probability){

        List<String> recommendations=new ArrayList<>();

        if(request.getToolWear()>200)
            recommendations.add(
                    "Replace cutting tool");

        if(request.getTorque()>60)
            recommendations.add(
                    "Reduce operating load");

        if(request.getAirTemperature()>310)
            recommendations.add(
                    "Inspect cooling system");

        if(probability>0.80)
            recommendations.add(
                    "Schedule immediate maintenance");

        if(recommendations.isEmpty())
            recommendations.add(
                    "Equipment operating normally");

        return recommendations;

    }

}