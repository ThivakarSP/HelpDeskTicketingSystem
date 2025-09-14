package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3001")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-enum-values")
    public String fixEnumValues() {
        try {
            // First check what status values exist and the column info
            String existingStatuses = jdbcTemplate.queryForObject(
                "SELECT GROUP_CONCAT(DISTINCT status) FROM tickets", String.class);
            
            // Check column length
            String columnInfo = jdbcTemplate.queryForObject(
                "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tickets' AND COLUMN_NAME = 'status'", 
                String.class);
            
            // Only update NEW status for now
            int updatedNew = jdbcTemplate.update("UPDATE tickets SET status = 'NEW' WHERE status = 'New'");
            
            return String.format("Column info: %s. Existing statuses: %s. Updated NEW: %d", 
                    columnInfo, existingStatuses, updatedNew);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}