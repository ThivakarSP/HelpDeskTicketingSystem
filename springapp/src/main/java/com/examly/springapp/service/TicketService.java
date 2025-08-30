package com.examly.springapp.service;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.TicketStatus;
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
    Ticket updateTicketStatus(Long id, TicketStatus status, String comment);
}
