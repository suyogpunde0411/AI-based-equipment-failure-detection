package com.suyog.equipmentfailureprediction.repository;

import com.suyog.equipmentfailureprediction.entity.PredictionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionHistoryRepository
        extends JpaRepository<PredictionHistory, Long> {

    List<PredictionHistory> findByEquipmentId(Long equipmentId);

}