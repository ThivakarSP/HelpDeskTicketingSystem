package com.examly.springapp.controller;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.TicketCategory;
import com.examly.springapp.model.TicketPriority;
import com.examly.springapp.model.TicketStatus;
import com.examly.springapp.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class TicketControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TicketRepository ticketRepository;

    @BeforeEach
    public void setup() {
        ticketRepository.deleteAll();
    }

    @Test
    void testCreateTicketSuccess() throws Exception {
        CreateTicketRequest req = new CreateTicketRequest();
        req.setTitle("MS Office not responding");
        req.setDescrtion("Microsoft Word crashes whenever I try to save a document with images.");
        req.setPriority("MEDIUM");
        req.setCategory("SOFTWARE");
        req.setReportedBy("john.doe@company.com");

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void testGetAllTickets() throws Exception {
        createTestTicket("Ticket 1", "Description 1", "LOW", "HARDWARE", "jane@company.com");
        createTestTicket("Ticket 2", "Description 2", "HIGH", "SOFTWARE", "alex@company.com");

        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testGetTicketByIdSuccess() throws Exception {
        Ticket ticket = createTestTicket("Ticket 3", "Description", "MEDIUM", "NETWORK", "eve@company.com");

        mockMvc.perform(get("/api/tickets/" + ticket.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Ticket 3"));
    }

    @Test
    void testGetTicketByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/tickets/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Ticket not found"));
    }

    @Test
    void testUpdateTicketStatusSuccess() throws Exception {
        Ticket ticket = createTestTicket("Ticket 4", "Desc", "LOW", "OTHER", "tom@company.com");
        UpdateTicketStatusRequest req = new UpdateTicketStatusRequest();
        req.setStatus("IN_PROGRESS");
        req.setComment("Investigating the issue. Will contact user for more details.");

        mockMvc.perform(patch("/api/tickets/" + ticket.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void testUpdateTicketStatusInvalidStatus() throws Exception {
        Ticket ticket = createTestTicket("Ticket 5", "Desc", "LOW", "OTHER", "bob@company.com");
        UpdateTicketStatusRequest req = new UpdateTicketStatusRequest();
        req.setStatus("INVALID");
        req.setComment("");

        mockMvc.perform(patch("/api/tickets/" + ticket.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Status must be one of")));
    }

    @Test
    void testUpdateTicketStatusTicketNotFound() throws Exception {
        UpdateTicketStatusRequest req = new UpdateTicketStatusRequest();
        req.setStatus("CLOSED");
        req.setComment("");
        mockMvc.perform(patch("/api/tickets/9999/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Ticket not found"));
    }

    private Ticket createTestTicket(String title, String description, String priority, String category, String reportedBy) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(TicketPriority.valueOf(priority));
        ticket.setCategory(TicketCategory.valueOf(category));
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setReportedBy(reportedBy);
        return ticketRepository.save(ticket);
    }
}
