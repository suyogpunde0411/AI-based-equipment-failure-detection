package com.suyog.equipmentfailureprediction.service;


import com.suyog.equipmentfailureprediction.dto.request.LoginRequest;
import com.suyog.equipmentfailureprediction.dto.request.RegisterRequest;
import com.suyog.equipmentfailureprediction.dto.response.AuthResponse;
import com.suyog.equipmentfailureprediction.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}