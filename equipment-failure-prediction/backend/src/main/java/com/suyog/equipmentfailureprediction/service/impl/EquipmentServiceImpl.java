package com.suyog.equipmentfailureprediction.service.impl;

import com.suyog.equipmentfailureprediction.dto.request.EquipmentRequest;
import com.suyog.equipmentfailureprediction.dto.response.EquipmentResponse;
import com.suyog.equipmentfailureprediction.entity.Equipment;
import com.suyog.equipmentfailureprediction.exception.ResourceAlreadyExistsException;
import com.suyog.equipmentfailureprediction.exception.ResourceNotFoundException;
import com.suyog.equipmentfailureprediction.repository.EquipmentRepository;
import com.suyog.equipmentfailureprediction.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository repository;

    @Override
    public EquipmentResponse createEquipment(EquipmentRequest request) {

        if (repository.existsByEquipmentCode(request.getEquipmentCode())) {
            throw new ResourceAlreadyExistsException("Equipment already exists");
        }

        Equipment equipment = Equipment.builder()
                .equipmentCode(request.getEquipmentCode())
                .machineName(request.getMachineName())
                .machineType(request.getMachineType())
                .manufacturer(request.getManufacturer())
                .location(request.getLocation())
                .installationDate(request.getInstallationDate())
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .build();

        Equipment saved = repository.save(equipment);

        return mapToResponse(saved);
    }

    @Override
    public EquipmentResponse getEquipment(Long id) {

        Equipment equipment = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Equipment not found"));

        return mapToResponse(equipment);
    }

    @Override
    public List<EquipmentResponse> getAllEquipment() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EquipmentResponse updateEquipment(Long id,
                                             EquipmentRequest request) {

        Equipment equipment = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Equipment not found"));

        equipment.setMachineName(request.getMachineName());
        equipment.setMachineType(request.getMachineType());
        equipment.setManufacturer(request.getManufacturer());
        equipment.setLocation(request.getLocation());
        equipment.setInstallationDate(request.getInstallationDate());
        equipment.setStatus(request.getStatus());

        Equipment updated = repository.save(equipment);

        return mapToResponse(updated);
    }

    @Override
    public void deleteEquipment(Long id) {

        Equipment equipment = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Equipment not found"));

        repository.delete(equipment);
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {

        return EquipmentResponse.builder()
                .id(equipment.getId())
                .equipmentCode(equipment.getEquipmentCode())
                .machineName(equipment.getMachineName())
                .machineType(equipment.getMachineType())
                .manufacturer(equipment.getManufacturer())
                .location(equipment.getLocation())
                .installationDate(equipment.getInstallationDate())
                .status(equipment.getStatus())
                .build();
    }

}