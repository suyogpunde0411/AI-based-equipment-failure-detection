package com.suyog.equipmentfailureprediction.entity;

import com.suyog.equipmentfailureprediction.enums.EquipmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment_code")
    private String equipmentCode;

    @Column(name = "machine_name")
    private String machineName;

    @Column(name = "machine_type")
    private String machineType;

    private String manufacturer;

    private String location;

    @Column(name = "installation_date")
    private LocalDate installationDate;

    @Enumerated(EnumType.STRING)
    private EquipmentStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<PredictionHistory> predictionHistories;
}