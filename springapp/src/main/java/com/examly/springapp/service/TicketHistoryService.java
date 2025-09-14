package com.examly.springapp.service;

import com.examly.springapp.model.TicketHistory;
import com.examly.springapp.dto.CreateTicketHistoryRequest;

import java.util.List;

public interface TicketHistoryService {
    List<TicketHistory> getAllTicketHistory();
    List<TicketHistory> getHistoryByTicketId(Long ticketId);
    TicketHistory getTicketHistoryById(Long id);
    TicketHistory createTicketHistory(CreateTicketHistoryRequest request);
    TicketHistory updateTicketHistory(Long id, CreateTicketHistoryRequest request);
    void deleteTicketHistory(Long id);
}