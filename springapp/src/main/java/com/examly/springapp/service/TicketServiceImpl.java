package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.TicketRepository;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository repo;

    @Override
    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    @Override
    public Ticket getTicketById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    @Override
    public Ticket createTicket(CreateTicketRequest req) {
        Ticket ticket = new Ticket();
        ticket.setTitle(req.getTitle());
        ticket.setDescription(req.getDescription());

        try {
            ticket.setPriority(TicketPriority.valueOf(req.getPriority()));
            ticket.setCategory(TicketCategory.valueOf(req.getCategory()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Priority/Category must be one of the predefined values");
        }

        ticket.setReportedBy(req.getReportedBy());
        ticket.setStatus(TicketStatus.OPEN);

        return repo.save(ticket);
    }

    @Override
    public Ticket updateTicketStatus(Long id, UpdateTicketStatusRequest req) {
        Ticket ticket = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        try {
            TicketStatus newStatus = TicketStatus.valueOf(req.getStatus());
            ticket.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED");
        }

        ticket.setComment(req.getComment());
        return repo.save(ticket);
    }
}
