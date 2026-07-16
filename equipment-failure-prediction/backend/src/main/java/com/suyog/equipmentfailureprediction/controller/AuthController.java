package com.suyog.equipmentfailureprediction.controller;


import com.suyog.equipmentfailureprediction.dto.request.LoginRequest;
import com.suyog.equipmentfailureprediction.dto.request.RegisterRequest;
import com.suyog.equipmentfailureprediction.dto.response.ApiResponse;
import com.suyog.equipmentfailureprediction.dto.response.AuthResponse;
import com.suyog.equipmentfailureprediction.dto.response.UserResponse;
import com.suyog.equipmentfailureprediction.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<UserResponse>builder()
                                .success(true)
                                .message("User registered successfully")
                                .data(authService.register(request))
                                .build()
                );    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid
            @RequestBody LoginRequest request){

        return ResponseEntity.ok(

                ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("Login Successful")
                        .data(authService.login(request))
                        .build()
        );

    }
}
