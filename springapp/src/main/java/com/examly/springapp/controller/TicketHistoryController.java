package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.CreateTicketHistoryRequest;
import com.examly.springapp.model.TicketHistory;
import com.examly.springapp.service.TicketHistoryService;

@RestController
@RequestMapping("/api/ticket-history")
@CrossOrigin(origins = "http://localhost:3001")
public class TicketHistoryController {

    private final TicketHistoryService service;

    public TicketHistoryController(TicketHistoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TicketHistory>> getAllTicketHistory() {
        try {
            List<TicketHistory> history = service.getAllTicketHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketHistory> getTicketHistoryById(@PathVariable Long id) {
        try {
            TicketHistory history = service.getTicketHistoryById(id);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<TicketHistory>> getHistoryByTicketId(@PathVariable Long ticketId) {
        try {
            List<TicketHistory> history = service.getHistoryByTicketId(ticketId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<TicketHistory> createTicketHistory(@RequestBody CreateTicketHistoryRequest req) {
        try {
            TicketHistory created = service.createTicketHistory(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketHistory> updateTicketHistory(@PathVariable Long id, @RequestBody CreateTicketHistoryRequest req) {
        try {
            TicketHistory updated = service.updateTicketHistory(id, req);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketHistory(@PathVariable Long id) {
        try {
            service.deleteTicketHistory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}