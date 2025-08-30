package com.examly.springapp.service;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.TicketStatus;
import com.examly.springapp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Override
    public Ticket createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCategory(request.getCategory());
        ticket.setReportedBy(request.getReportedBy());
        ticket.setStatus(TicketStatus.OPEN);
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);
        
        return ticketRepository.save(ticket);
    }
    
    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }
    
    @Override
    public Ticket updateTicketStatus(Long id, TicketStatus status, String comment) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        ticket.setStatus(status);
        if (comment != null && !comment.trim().isEmpty()) {
            ticket.setComment(comment);
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        
        return ticketRepository.save(ticket);
    }
}
