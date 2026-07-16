package com.suyog.equipmentfailureprediction.repository;

import com.suyog.equipmentfailureprediction.entity.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorReadingRepository
        extends JpaRepository<SensorReading, Long> {

    List<SensorReading> findByEquipmentId(Long equipmentId);

}