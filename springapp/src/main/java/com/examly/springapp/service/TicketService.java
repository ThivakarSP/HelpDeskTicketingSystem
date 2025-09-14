package com.examly.springapp.service;

import java.util.List;
import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.model.Ticket;

public interface TicketService {

    List<Ticket> getAllTickets();

    Ticket getTicketById(Long id);

    Ticket createTicket(CreateTicketRequest req);

    Ticket updateTicketStatus(Long id, UpdateTicketStatusRequest req);

    Ticket updateTicket(Long id, CreateTicketRequest req);

    void deleteTicket(Long id);
}
