package com.examly.springapp.service;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.model.Ticket;
import java.util.List;

public interface TicketService {
    
    /**
     * Create a new ticket
     */
    Ticket createTicket(CreateTicketRequest request);
    
    /**
     * Get all tickets
     */
    List<Ticket> getAllTickets();
    
    /**
     * Get ticket by ID
     */
    Ticket getTicketById(Long id);
    
    /**
     * Update ticket status
     */
    Ticket updateTicketStatus(Long id, String status, String comment);
}
