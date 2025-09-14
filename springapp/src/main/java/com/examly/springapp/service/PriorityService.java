package com.examly.springapp.service;

import com.examly.springapp.model.Priority;
import java.util.List;
import java.util.Optional;

public interface PriorityService {
    List<Priority> getAllPriorities();
    Optional<Priority> getPriorityById(Long id);
    Priority createPriority(Priority priority);
    Priority updatePriority(Long id, Priority priority);
    void deletePriority(Long id);
    Priority getPriorityByName(String name);
}