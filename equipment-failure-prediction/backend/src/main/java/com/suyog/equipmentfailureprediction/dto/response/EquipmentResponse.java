package com.suyog.equipmentfailureprediction.dto.response;

import com.suyog.equipmentfailureprediction.enums.EquipmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EquipmentResponse {

    private Long id;

    private String equipmentCode;

    private String machineName;

    private String machineType;

    private String manufacturer;

    private String location;

    private LocalDate installationDate;

    private EquipmentStatus status;

}