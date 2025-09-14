package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.dto.CreateUserRequest;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @Override
    public User getUserByEmail(String email) {
        // Using findAll and filter to avoid missing repository method
        return userRepository.findAll().stream()
                .filter(user -> email.equals(user.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword()); // In real app, should be hashed
        // Set role from request, default to EMPLOYEE if invalid/missing
        try {
            if (request.getRole() != null && !request.getRole().isBlank()) {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } else {
                user.setRole(User.Role.EMPLOYEE);
            }
        } catch (IllegalArgumentException ex) {
            user.setRole(User.Role.EMPLOYEE);
        }
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, CreateUserRequest request) {
        User user = getUserById(id);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(request.getPassword()); // In real app, should be hashed
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
                // ignore invalid role values on update
            }
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}