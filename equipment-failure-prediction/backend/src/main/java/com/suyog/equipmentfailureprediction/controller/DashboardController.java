package com.suyog.equipmentfailureprediction.controller;

import com.suyog.equipmentfailureprediction.dto.response.dashboard.DashboardResponse;
import com.suyog.equipmentfailureprediction.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboard();

    }

}