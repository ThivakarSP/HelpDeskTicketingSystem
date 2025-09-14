package com.examly.springapp.service;

import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.SignupRequest;
import com.examly.springapp.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse signup(SignupRequest request);
}