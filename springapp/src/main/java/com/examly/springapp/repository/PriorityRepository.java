package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.examly.springapp.model.Priority;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {
	Priority findByName(String name);
	Priority findByNameIgnoreCase(String name);
}