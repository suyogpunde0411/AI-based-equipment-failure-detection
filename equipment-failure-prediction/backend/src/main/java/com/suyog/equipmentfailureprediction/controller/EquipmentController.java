package com.suyog.equipmentfailureprediction.controller;

import com.suyog.equipmentfailureprediction.dto.request.EquipmentRequest;
import com.suyog.equipmentfailureprediction.dto.response.ApiResponse;
import com.suyog.equipmentfailureprediction.dto.response.EquipmentResponse;
import com.suyog.equipmentfailureprediction.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService service;

    @PostMapping
    public ResponseEntity<ApiResponse<EquipmentResponse>> create(
            @Valid @RequestBody EquipmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<EquipmentResponse>builder()
                        .success(true)
                        .message("Equipment created successfully")
                        .data(service.createEquipment(request))
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.<EquipmentResponse>builder()
                        .success(true)
                        .message("Equipment fetched successfully")
                        .data(service.getEquipment(id))
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.<List<EquipmentResponse>>builder()
                        .success(true)
                        .message("Equipment list fetched successfully")
                        .data(service.getAllEquipment())
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<EquipmentResponse>builder()
                        .success(true)
                        .message("Equipment updated successfully")
                        .data(service.updateEquipment(id, request))
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id) {

        service.deleteEquipment(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Equipment deleted successfully")
                        .data(null)
                        .build());
    }
}