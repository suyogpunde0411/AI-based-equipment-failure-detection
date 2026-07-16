package com.suyog.equipmentfailureprediction.dto.request;

import com.suyog.equipmentfailureprediction.enums.EquipmentStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EquipmentRequest {

    private String equipmentCode;

    private String machineName;

    private String machineType;

    private String manufacturer;

    private String location;

    private LocalDate installationDate;

    private EquipmentStatus status;

}