package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.MlPredictionResponse;
import com.suyog.equipmentfailureprediction.service.MlService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class MlServiceImpl implements MlService {

    private final RestClient restClient;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @Override
    public MlPredictionResponse predict(PredictionRequest request) {

        return restClient.post()
                .uri(mlServiceUrl + "/predict")
                .body(request)
                .retrieve()
                .body(MlPredictionResponse.class);
    }

}