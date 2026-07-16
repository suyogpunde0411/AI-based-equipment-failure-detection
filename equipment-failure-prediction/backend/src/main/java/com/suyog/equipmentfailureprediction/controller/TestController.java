package com.suyog.equipmentfailureprediction.controller;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.MlPredictionResponse;
import com.suyog.equipmentfailureprediction.service.MlService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final MlService mlService;

    @PostMapping
    public MlPredictionResponse predict(
            @RequestBody PredictionRequest request){

        return mlService.predict(request);

    }

}