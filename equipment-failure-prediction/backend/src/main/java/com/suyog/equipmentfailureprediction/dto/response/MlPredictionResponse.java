package com.suyog.equipmentfailureprediction.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MlPredictionResponse {

    private Boolean failure;

    private Double probability;

    private Double confidence;

    private List<String> topFactors;

}