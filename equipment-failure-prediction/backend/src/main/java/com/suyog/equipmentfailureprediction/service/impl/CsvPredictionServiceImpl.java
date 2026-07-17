package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.PredictionRequest;
import com.suyog.equipmentfailureprediction.dto.response.CsvPredictionResponse;
import com.suyog.equipmentfailureprediction.service.CsvPredictionService;
import com.suyog.equipmentfailureprediction.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;

@Service
@RequiredArgsConstructor
public class CsvPredictionServiceImpl implements CsvPredictionService {

    private final PredictionService predictionService;

    @Override
    public CsvPredictionResponse predictFromCsv(MultipartFile file) {

        int totalRows = 0;
        int success = 0;
        int failed = 0;

        try {

            Reader reader = new InputStreamReader(file.getInputStream());

            CSVParser csvParser = CSVFormat.DEFAULT
                    .builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build()
                    .parse(reader);

            for (CSVRecord record : csvParser) {

                totalRows++;

                try {

                    PredictionRequest request = PredictionRequest.builder()
                            .equipmentId(
                                    Long.parseLong(record.get("equipmentId")))
                            .airTemperature(
                                    Double.parseDouble(record.get("airTemperature")))
                            .processTemperature(
                                    Double.parseDouble(record.get("processTemperature")))
                            .rotationalSpeed(
                                    Double.parseDouble(record.get("rotationalSpeed")))
                            .torque(
                                    Double.parseDouble(record.get("torque")))
                            .toolWear(
                                    Double.parseDouble(record.get("toolWear")))
                            .build();

                    predictionService.predict(request);

                    success++;

                }
                catch (Exception e){

                    failed++;

                }

            }

        }
        catch (Exception e){

            throw new RuntimeException("Unable to read CSV file");

        }

        return CsvPredictionResponse.builder()
                .totalRows(totalRows)
                .successPredictions(success)
                .failedPredictions(failed)
                .build();

    }

}