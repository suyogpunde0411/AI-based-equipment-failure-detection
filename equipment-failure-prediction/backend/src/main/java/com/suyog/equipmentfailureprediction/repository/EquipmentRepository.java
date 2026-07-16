package com.suyog.equipmentfailureprediction.repository;

import com.suyog.equipmentfailureprediction.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipmentRepository
        extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByEquipmentCode(String code);

    boolean existsByEquipmentCode(String code);

}