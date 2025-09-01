package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService service;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return service.getTicketById(id);
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody CreateTicketRequest req) {
        Ticket created = service.createTicket(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable Long id, @RequestBody UpdateTicketStatusRequest req) {
        return service.updateTicketStatus(id, req);
    }
}
