package com.examly.springapp.service;

import com.examly.springapp.model.Priority;
import com.examly.springapp.repository.PriorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PriorityServiceImpl implements PriorityService {
    
    @Autowired
    private PriorityRepository priorityRepository;
    
    @Override
    public List<Priority> getAllPriorities() {
        return priorityRepository.findAll();
    }
    
    @Override
    public Optional<Priority> getPriorityById(Long id) {
        return priorityRepository.findById(id);
    }
    
    @Override
    public Priority createPriority(Priority priority) {
        return priorityRepository.save(priority);
    }
    
    @Override
    public Priority updatePriority(Long id, Priority priority) {
        if (priorityRepository.existsById(id)) {
            priority.setId(id);
            return priorityRepository.save(priority);
        }
        throw new RuntimeException("Priority not found with id: " + id);
    }
    
    @Override
    public void deletePriority(Long id) {
        priorityRepository.deleteById(id);
    }
    
    @Override
    public Priority getPriorityByName(String name) {
        return priorityRepository.findByName(name);
    }
}