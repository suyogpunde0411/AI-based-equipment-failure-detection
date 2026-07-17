package com.suyog.equipmentfailureprediction.dto.response.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentHealthResponse {

    private String machineName;

    private Double healthScore;

}