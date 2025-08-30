package com.examly.springapp.controller;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.TicketCategory;
import com.examly.springapp.model.TicketPriority;
import com.examly.springapp.model.TicketStatus;
import com.examly.springapp.service.TicketService;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TicketController.class)
public class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TicketService ticketService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateTicketSuccess() throws Exception {
        // Arrange
        CreateTicketRequest request = new CreateTicketRequest(
            "Test Ticket",
            "Test Description",
            TicketPriority.HIGH,
            TicketCategory.SOFTWARE,
            "test@example.com"
        );

        Ticket mockTicket = new Ticket();
        mockTicket.setId(1L);
        mockTicket.setTitle("Test Ticket");
        mockTicket.setDescription("Test Description");
        mockTicket.setPriority(TicketPriority.HIGH);
        mockTicket.setCategory(TicketCategory.SOFTWARE);
        mockTicket.setReportedBy("test@example.com");
        mockTicket.setStatus(TicketStatus.OPEN);
        mockTicket.setCreatedAt(LocalDateTime.now());
        mockTicket.setUpdatedAt(LocalDateTime.now());

        when(ticketService.createTicket(any(CreateTicketRequest.class))).thenReturn(mockTicket);

        // Act & Assert
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Ticket"))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    public void testGetAllTickets() throws Exception {
        // Arrange
        Ticket ticket1 = new Ticket();
        ticket1.setId(1L);
        ticket1.setTitle("Ticket 1");
        ticket1.setDescription("Description 1");
        ticket1.setPriority(TicketPriority.HIGH);
        ticket1.setCategory(TicketCategory.SOFTWARE);
        ticket1.setReportedBy("user1@example.com");
        ticket1.setStatus(TicketStatus.OPEN);
        ticket1.setCreatedAt(LocalDateTime.now());
        ticket1.setUpdatedAt(LocalDateTime.now());

        Ticket ticket2 = new Ticket();
        ticket2.setId(2L);
        ticket2.setTitle("Ticket 2");
        ticket2.setDescription("Description 2");
        ticket2.setPriority(TicketPriority.MEDIUM);
        ticket2.setCategory(TicketCategory.HARDWARE);
        ticket2.setReportedBy("user2@example.com");
        ticket2.setStatus(TicketStatus.IN_PROGRESS);
        ticket2.setCreatedAt(LocalDateTime.now());
        ticket2.setUpdatedAt(LocalDateTime.now());

        List<Ticket> tickets = Arrays.asList(ticket1, ticket2);
        when(ticketService.getAllTickets()).thenReturn(tickets);

        // Act & Assert
        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    public void testGetTicketByIdSuccess() throws Exception {
        // Arrange
        Ticket mockTicket = new Ticket();
        mockTicket.setId(1L);
        mockTicket.setTitle("Test Ticket");
        mockTicket.setDescription("Test Description");
        mockTicket.setPriority(TicketPriority.HIGH);
        mockTicket.setCategory(TicketCategory.SOFTWARE);
        mockTicket.setReportedBy("test@example.com");
        mockTicket.setStatus(TicketStatus.OPEN);
        mockTicket.setCreatedAt(LocalDateTime.now());
        mockTicket.setUpdatedAt(LocalDateTime.now());

        when(ticketService.getTicketById(1L)).thenReturn(mockTicket);

        // Act & Assert
        mockMvc.perform(get("/api/tickets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Ticket"));
    }

    @Test
    public void testGetTicketByIdNotFound() throws Exception {
        // Arrange
        when(ticketService.getTicketById(999L)).thenThrow(new ResourceNotFoundException("Ticket not found with id: 999"));

        // Act & Assert
        mockMvc.perform(get("/api/tickets/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateTicketStatusSuccess() throws Exception {
        // Arrange
        UpdateTicketStatusRequest request = new UpdateTicketStatusRequest(TicketStatus.IN_PROGRESS, "Investigating the issue. Will contact user for more details.");

        Ticket mockTicket = new Ticket();
        mockTicket.setId(1L);
        mockTicket.setTitle("Test Ticket");
        mockTicket.setDescription("Test Description");
        mockTicket.setPriority(TicketPriority.HIGH);
        mockTicket.setCategory(TicketCategory.SOFTWARE);
        mockTicket.setReportedBy("test@example.com");
        mockTicket.setStatus(TicketStatus.IN_PROGRESS);
        mockTicket.setComment("Investigating the issue. Will contact user for more details.");
        mockTicket.setCreatedAt(LocalDateTime.now());
        mockTicket.setUpdatedAt(LocalDateTime.now());

        when(ticketService.updateTicketStatus(eq(1L), eq(TicketStatus.IN_PROGRESS), any(String.class))).thenReturn(mockTicket);

        // Act & Assert
        mockMvc.perform(patch("/api/tickets/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.comment").value("Investigating the issue. Will contact user for more details."));
    }

    @Test
    public void testUpdateTicketStatusInvalidStatus() throws Exception {
        // Act & Assert - Testing with invalid JSON that should cause validation error
        mockMvc.perform(patch("/api/tickets/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"INVALID_STATUS\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdateTicketStatusTicketNotFound() throws Exception {
        // Arrange
        UpdateTicketStatusRequest request = new UpdateTicketStatusRequest(TicketStatus.IN_PROGRESS, "Investigating the issue.");
        
        when(ticketService.updateTicketStatus(eq(999L), eq(TicketStatus.IN_PROGRESS), any(String.class)))
                .thenThrow(new ResourceNotFoundException("Ticket not found with id: 999"));

        // Act & Assert
        mockMvc.perform(patch("/api/tickets/999/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}
