package com.suyog.equipmentfailureprediction.repository;

import com.suyog.equipmentfailureprediction.entity.PredictionHistory;
import com.suyog.equipmentfailureprediction.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PredictionHistoryRepository
        extends JpaRepository<PredictionHistory, Long> {
    @Query("SELECT AVG(p.healthScore) FROM PredictionHistory p")
    Double getAverageHealthScore();

    Long countByRiskLevel(RiskLevel riskLevel);

    @Query("""
        SELECT p
        FROM PredictionHistory p
        JOIN FETCH p.equipment
        ORDER BY p.createdAt DESC
        """)
    List<PredictionHistory> findTop10ByOrderByCreatedAtDesc();
    //List<PredictionHistory> findByEquipmentId(Long equipmentId);

}