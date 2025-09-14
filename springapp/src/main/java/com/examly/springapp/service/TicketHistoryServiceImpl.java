package com.examly.springapp.service;

import com.examly.springapp.model.TicketHistory;
import com.examly.springapp.dto.CreateTicketHistoryRequest;
import com.examly.springapp.repository.TicketHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketHistoryServiceImpl implements TicketHistoryService {

    private final TicketHistoryRepository ticketHistoryRepository;

    public TicketHistoryServiceImpl(TicketHistoryRepository ticketHistoryRepository) {
        this.ticketHistoryRepository = ticketHistoryRepository;
    }

    @Override
    public List<TicketHistory> getAllTicketHistory() {
        return ticketHistoryRepository.findAll();
    }

    @Override
    public List<TicketHistory> getHistoryByTicketId(Long ticketId) {
        // Using findAll for now - can be enhanced later with proper query method
        return ticketHistoryRepository.findAll().stream()
                .filter(history -> ticketId.equals(history.getTicket() != null ? history.getTicket().getId() : null))
                .sorted((h1, h2) -> h2.getTimestamp().compareTo(h1.getTimestamp()))
                .collect(Collectors.toList());
    }

    @Override
    public TicketHistory getTicketHistoryById(Long id) {
        return ticketHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket history not found with ID: " + id));
    }

    @Override
    public TicketHistory createTicketHistory(CreateTicketHistoryRequest request) {
        TicketHistory history = new TicketHistory();
        history.setComment(request.getComment());
        history.setStatusChangeFrom(request.getStatusChangeFrom());
        history.setStatusChangeTo(request.getStatusChangeTo());
        history.setTimestamp(LocalDateTime.now());
        return ticketHistoryRepository.save(history);
    }

    @Override
    public TicketHistory updateTicketHistory(Long id, CreateTicketHistoryRequest request) {
        TicketHistory history = getTicketHistoryById(id);
        history.setComment(request.getComment());
        history.setStatusChangeFrom(request.getStatusChangeFrom());
        history.setStatusChangeTo(request.getStatusChangeTo());
        return ticketHistoryRepository.save(history);
    }

    @Override
    public void deleteTicketHistory(Long id) {
        TicketHistory history = getTicketHistoryById(id);
        ticketHistoryRepository.delete(history);
    }
}