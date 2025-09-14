package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.dto.CreateUserRequest;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByEmail(String email);
    User createUser(CreateUserRequest request);
    User updateUser(Long id, CreateUserRequest request);
    void deleteUser(Long id);
}