package com.suyog.equipmentfailureprediction.controller;

import com.suyog.equipmentfailureprediction.dto.response.CsvPredictionResponse;
import com.suyog.equipmentfailureprediction.service.CsvPredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class CsvPredictionController {

    private final CsvPredictionService csvPredictionService;

    @PostMapping("/upload")
    public CsvPredictionResponse upload(
            @RequestParam("file") MultipartFile file) {

        return csvPredictionService.predictFromCsv(file);

    }
}