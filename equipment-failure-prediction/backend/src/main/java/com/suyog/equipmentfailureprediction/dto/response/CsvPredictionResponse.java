package com.suyog.equipmentfailureprediction.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CsvPredictionResponse {

    private int totalRows;

    private int successPredictions;

    private int failedPredictions;

}