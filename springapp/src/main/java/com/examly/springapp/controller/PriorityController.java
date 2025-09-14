package com.examly.springapp.controller;

import com.examly.springapp.dto.CreatePriorityRequest;
import com.examly.springapp.model.Priority;
import com.examly.springapp.service.PriorityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/priorities")
public class PriorityController {
    
    @Autowired
    private PriorityService priorityService;
    
    @GetMapping
    public ResponseEntity<List<Priority>> getAllPriorities() {
        List<Priority> priorities = priorityService.getAllPriorities();
        return ResponseEntity.ok(priorities);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Priority> getPriorityById(@PathVariable Long id) {
        Optional<Priority> priority = priorityService.getPriorityById(id);
        return priority.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Priority> createPriority(@RequestBody CreatePriorityRequest request) {
        Priority priority = new Priority();
        priority.setName(request.getName());
        priority.setDescription(request.getDescription());
        
        Priority createdPriority = priorityService.createPriority(priority);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPriority);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Priority> updatePriority(@PathVariable Long id, 
                                                 @RequestBody CreatePriorityRequest request) {
        try {
            Priority priority = new Priority();
            priority.setName(request.getName());
            priority.setDescription(request.getDescription());
            
            Priority updatedPriority = priorityService.updatePriority(id, priority);
            return ResponseEntity.ok(updatedPriority);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePriority(@PathVariable Long id) {
        try {
            priorityService.deletePriority(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<Priority> getPriorityByName(@RequestParam String name) {
        Priority priority = priorityService.getPriorityByName(name);
        if (priority != null) {
            return ResponseEntity.ok(priority);
        }
        return ResponseEntity.notFound().build();
    }
}