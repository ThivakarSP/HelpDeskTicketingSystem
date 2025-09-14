package com.examly.springapp.service;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.SignupRequest;
import com.examly.springapp.dto.CreateUserRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService;

    public AuthServiceImpl(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new RuntimeException("Username and password are required");
        }

        // For demo purposes, handle hardcoded users
        if ("admin".equals(request.getUsername()) && "admin123".equals(request.getPassword())) {
            return new AuthResponse(1L, "admin", "admin", "Login successful");
        }
        
        if ("user".equals(request.getUsername()) && "user123".equals(request.getPassword())) {
            return new AuthResponse(2L, "user", "user", "Login successful");
        }

        // Try to find user by email or name in the database
        List<User> allUsers = userRepository.findAll();
        User user = allUsers.stream()
                .filter(u -> request.getUsername().equals(u.getEmail()) || request.getUsername().equals(u.getName()))
                .filter(u -> request.getPassword().equals(u.getPasswordHash())) // In real app, use password hashing
                .findFirst()
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }

        String role = user.getRole().name().toLowerCase();
        return new AuthResponse(user.getId(), user.getName(), role, "Login successful");
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        if (request.getUsername() == null || request.getPassword() == null || 
            request.getEmail() == null || request.getRole() == null) {
            throw new RuntimeException("All fields are required");
        }

        // Check if user already exists
        List<User> allUsers = userRepository.findAll();
        boolean userExists = allUsers.stream()
                .anyMatch(u -> request.getEmail().equals(u.getEmail()) || request.getUsername().equals(u.getName()));

        if (userExists) {
            throw new RuntimeException("User already exists with this email or username");
        }

        // Create new user
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setName(request.getUsername());
        createUserRequest.setEmail(request.getEmail());
        createUserRequest.setPassword(request.getPassword());
        createUserRequest.setRole(request.getRole());

        try {
            User newUser = userService.createUser(createUserRequest);
            String role = newUser.getRole().name().toLowerCase();
            return new AuthResponse(newUser.getId(), newUser.getName(), role, "User created successfully");
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }
}