package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.request.EquipmentRequest;
import com.suyog.equipmentfailureprediction.dto.response.EquipmentResponse;

import java.util.List;

public interface EquipmentService {

    EquipmentResponse createEquipment(EquipmentRequest request);

    EquipmentResponse getEquipment(Long id);

    List<EquipmentResponse> getAllEquipment();

    EquipmentResponse updateEquipment(Long id,
                                      EquipmentRequest request);

    void deleteEquipment(Long id);

}