package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.response.CsvPredictionResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CsvPredictionService {

    CsvPredictionResponse predictFromCsv(MultipartFile file);

}