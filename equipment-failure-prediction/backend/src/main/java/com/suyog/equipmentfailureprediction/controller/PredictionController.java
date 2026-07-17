package com.suyog.equipmentfailureprediction.controller;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.PredictionResponse;
import com.suyog.equipmentfailureprediction.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping
    public PredictionResponse predict(
            @Valid @RequestBody PredictionRequest request) {

        return predictionService.predict(request);
    }
}