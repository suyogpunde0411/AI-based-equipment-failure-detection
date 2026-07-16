package com.suyog.equipmentfailureprediction.service;

import com.suyog.equipmentfailureprediction.dto.request.SensorReadingRequest;
import com.suyog.equipmentfailureprediction.dto.response.SensorReadingResponse;

import java.util.List;

public interface SensorReadingService {

    SensorReadingResponse createSensorReading(SensorReadingRequest request);

    SensorReadingResponse getSensorReading(Long id);

    List<SensorReadingResponse> getAllSensorReadings();

    List<SensorReadingResponse> getSensorReadingsByEquipment(Long equipmentId);

}