package com.examly.springapp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.User;
import com.examly.springapp.service.TicketService;
import com.examly.springapp.service.UserService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DashboardController {

    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Dashboard controller is working");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugTicketData() {
        try {
            Map<String, Object> debug = new HashMap<>();
            List<Ticket> allTickets = ticketService.getAllTickets();
            
            debug.put("totalTickets", allTickets.size());
            
            // Show all status values
            List<String> allStatuses = allTickets.stream()
                .map(t -> "'" + t.getStatus().getValue() + "'")
                .collect(java.util.stream.Collectors.toList());
            debug.put("allStatusValues", allStatuses);
            
            if (!allTickets.isEmpty()) {
                debug.put("firstTicketData", Map.of(
                    "id", allTickets.get(0).getId(),
                    "status", "'" + allTickets.get(0).getStatus().getValue() + "'",
                    "priority", "'" + allTickets.get(0).getPriority().getName() + "'",
                    "category", "'" + allTickets.get(0).getCategory().getName() + "'"
                ));
            }
            
            // Manual count test with detailed status checking
            Map<String, Object> statusDebug = new HashMap<>();
            for (Ticket t : allTickets) {
                String status = t.getStatus().getValue();
                statusDebug.put("Ticket_" + t.getId() + "_status", "'" + status + "' (length: " + status.length() + ")");
            }
            debug.put("detailedStatusCheck", statusDebug);
            
            // Test exact matches
            long newCount = allTickets.stream().filter(t -> "New".equals(t.getStatus().getValue())).count();
            long inProgressCount = allTickets.stream().filter(t -> "In Progress".equals(t.getStatus().getValue())).count();
            long resolvedCount = allTickets.stream().filter(t -> "Resolved".equals(t.getStatus().getValue())).count();
            long closedCount = allTickets.stream().filter(t -> "Closed".equals(t.getStatus().getValue())).count();
            
            debug.put("manualStatusCounts", Map.of(
                "New", newCount,
                "In Progress", inProgressCount, 
                "Resolved", resolvedCount,
                "Closed", closedCount
            ));
            
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Initialize counts
            int totalTickets = 0;
            int totalUsers = 0;
            List<Ticket> allTickets = List.of();
            List<User> allUsers = List.of();
            
            // Get data safely
            try {
                allTickets = ticketService.getAllTickets();
                totalTickets = allTickets != null ? allTickets.size() : 0;
            } catch (Exception e) {
                System.err.println("Error getting tickets: " + e.getMessage());
            }
            
            try {
                allUsers = userService.getAllUsers();
                totalUsers = allUsers != null ? allUsers.size() : 0;
            } catch (Exception e) {
                System.err.println("Error getting users: " + e.getMessage());
            }
            
            // Basic counts
            stats.put("totalTickets", totalTickets);
            stats.put("totalUsers", totalUsers);
            
            // Status breakdown - using actual ticket data
            Map<String, Long> statusCounts = new HashMap<>();
            statusCounts.put("New", allTickets.stream().filter(t -> t.getStatus() != null && "New".equals(t.getStatus().getValue())).count());
            statusCounts.put("In Progress", allTickets.stream().filter(t -> t.getStatus() != null && "In Progress".equals(t.getStatus().getValue())).count());
            statusCounts.put("Resolved", allTickets.stream().filter(t -> t.getStatus() != null && "Resolved".equals(t.getStatus().getValue())).count());
            statusCounts.put("Closed", allTickets.stream().filter(t -> t.getStatus() != null && "Closed".equals(t.getStatus().getValue())).count());
            stats.put("statusCounts", statusCounts);
            
            // Open tickets count (all tickets that are NOT closed)
            long openTicketsCount = allTickets.stream().filter(t -> t.getStatus() != null && !"Closed".equals(t.getStatus().getValue())).count();
            stats.put("openTickets", openTicketsCount);
            
            // Priority breakdown
            Map<String, Long> priorityCounts = new HashMap<>();
            priorityCounts.put("Low", allTickets.stream().filter(t -> t.getPriority() != null && "Low".equals(t.getPriority().getName())).count());
            priorityCounts.put("Medium", allTickets.stream().filter(t -> t.getPriority() != null && "Medium".equals(t.getPriority().getName())).count());
            priorityCounts.put("High", allTickets.stream().filter(t -> t.getPriority() != null && "High".equals(t.getPriority().getName())).count());
            priorityCounts.put("Urgent", allTickets.stream().filter(t -> t.getPriority() != null && "Urgent".equals(t.getPriority().getName())).count());
            priorityCounts.put("Critical", allTickets.stream().filter(t -> t.getPriority() != null && "Critical".equals(t.getPriority().getName())).count());
            stats.put("priorityCounts", priorityCounts);
            
            // Category breakdown
            Map<String, Long> categoryCounts = new HashMap<>();
            categoryCounts.put("Technical Support", allTickets.stream().filter(t -> t.getCategory() != null && "Technical Support".equals(t.getCategory().getName())).count());
            categoryCounts.put("Software Request", allTickets.stream().filter(t -> t.getCategory() != null && "Software Request".equals(t.getCategory().getName())).count());
            categoryCounts.put("Hardware Issue", allTickets.stream().filter(t -> t.getCategory() != null && "Hardware Issue".equals(t.getCategory().getName())).count());
            categoryCounts.put("Account Management", allTickets.stream().filter(t -> t.getCategory() != null && "Account Management".equals(t.getCategory().getName())).count());
            categoryCounts.put("Network Problem", allTickets.stream().filter(t -> t.getCategory() != null && "Network Problem".equals(t.getCategory().getName())).count());
            stats.put("categoryCounts", categoryCounts);
            
            // Recent tickets (last 5)
            List<Ticket> recentTickets = allTickets.stream()
                .filter(t -> t != null)
                .sorted((t1, t2) -> {
                    if (t1.getCreatedAt() == null && t2.getCreatedAt() == null) return 0;
                    if (t1.getCreatedAt() == null) return 1;
                    if (t2.getCreatedAt() == null) return -1;
                    return t2.getCreatedAt().compareTo(t1.getCreatedAt());
                })
                .limit(5)
                .toList();
            stats.put("recentTickets", recentTickets);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Dashboard stats error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}