package com.examly.springapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.Category;
import com.examly.springapp.model.Priority;
import com.examly.springapp.repository.CategoryRepository;
import com.examly.springapp.repository.PriorityRepository;

@RestController
@RequestMapping("/api/lookups")
@CrossOrigin(origins = "http://localhost:3001")
public class LookupController {

    private final CategoryRepository categoryRepository;
    private final PriorityRepository priorityRepository;

    public LookupController(CategoryRepository categoryRepository, PriorityRepository priorityRepository) {
        this.categoryRepository = categoryRepository;
        this.priorityRepository = priorityRepository;
    }

    @GetMapping("/categories")
    public List<Category> categories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/priorities")
    public List<Priority> priorities() {
        return priorityRepository.findAll();
    }
}
