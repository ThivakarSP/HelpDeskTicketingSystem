package com.examly.springapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.dto.CreateTicketRequest;
import com.examly.springapp.dto.UpdateTicketStatusRequest;
import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.TicketStatus;
import com.examly.springapp.model.Priority;
import com.examly.springapp.model.Category;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.PriorityRepository;
import com.examly.springapp.repository.CategoryRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.TicketRepository;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final PriorityRepository priorityRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             PriorityRepository priorityRepository,
                             CategoryRepository categoryRepository,
                             UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.priorityRepository = priorityRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket getTicketById(Long id) {
        if (id == null) {
            throw new RuntimeException("Ticket ID cannot be null");
        }
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));
    }

    @Override
    public Ticket createTicket(CreateTicketRequest req) {
        Ticket ticket = new Ticket();
        ticket.setTitle(req.getTitle());
        ticket.setDescription(req.getDescription());

        // Resolve priority
        Priority priority = null;
        if (req.getPriorityId() != null) {
            priority = priorityRepository.findById(req.getPriorityId())
                    .orElseThrow(() -> new BadRequestException("Invalid priorityId"));
        } else if (req.getPriority() != null) {
            priority = priorityRepository.findByNameIgnoreCase(req.getPriority().trim());
            if (priority == null) throw new BadRequestException("Invalid priority name. Allowed: " + getAllowedPriorities());
        }
        ticket.setPriority(priority);

        // Resolve category
        Category category = null;
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Invalid categoryId"));
        } else if (req.getCategory() != null) {
            category = categoryRepository.findByNameIgnoreCase(req.getCategory().trim());
            if (category == null) throw new BadRequestException("Invalid category name. Allowed: " + getAllowedCategories());
        }
        ticket.setCategory(category);

        // Submitter / Assigned Agent
        if (req.getSubmitterId() != null) {
            User submitter = userRepository.findById(req.getSubmitterId())
                    .orElseThrow(() -> new BadRequestException("Invalid submitterId"));
            ticket.setSubmitter(submitter);
        } else {
            throw new BadRequestException("submitterId is required");
        }
        if (req.getAssignedAgentId() != null) {
            User agent = userRepository.findById(req.getAssignedAgentId())
                    .orElseThrow(() -> new BadRequestException("Invalid assignedAgentId"));
            ticket.setAssignedAgent(agent);
        }

        ticket.setStatus(TicketStatus.New);

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket updateTicketStatus(Long id, UpdateTicketStatusRequest req) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        try {
            TicketStatus newStatus = TicketStatus.fromString(req.getStatus());
            ticket.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        // Comment functionality removed as per new schema
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket updateTicket(Long id, CreateTicketRequest req) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setTitle(req.getTitle());
        ticket.setDescription(req.getDescription());

        // Update priority/category via ids if provided
        if (req.getPriorityId() != null) {
            ticket.setPriority(priorityRepository.findById(req.getPriorityId())
                    .orElseThrow(() -> new BadRequestException("Invalid priorityId")));
        } else if (req.getPriority() != null) {
            Priority p = priorityRepository.findByNameIgnoreCase(req.getPriority().trim());
            if (p == null) throw new BadRequestException("Invalid priority name. Allowed: " + getAllowedPriorities());
            ticket.setPriority(p);
        }
        if (req.getCategoryId() != null) {
            ticket.setCategory(categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Invalid categoryId")));
        } else if (req.getCategory() != null) {
            Category c = categoryRepository.findByNameIgnoreCase(req.getCategory().trim());
            if (c == null) throw new BadRequestException("Invalid category name. Allowed: " + getAllowedCategories());
            ticket.setCategory(c);
        }
        if (req.getSubmitterId() != null) {
            ticket.setSubmitter(userRepository.findById(req.getSubmitterId())
                    .orElseThrow(() -> new BadRequestException("Invalid submitterId")));
        } else if (ticket.getSubmitter() == null) {
            throw new BadRequestException("submitterId is required");
        }
        if (req.getAssignedAgentId() != null) {
            ticket.setAssignedAgent(userRepository.findById(req.getAssignedAgentId())
                    .orElseThrow(() -> new BadRequestException("Invalid assignedAgentId")));
        }

        return ticketRepository.save(ticket);
    }

    @Override
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticketRepository.delete(ticket);
    }

    // Helper methods to list allowed names for clearer error messages
    private String getAllowedCategories() {
        return categoryRepository.findAll().stream()
                .map(Category::getName)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .reduce((a, b) -> a + ", " + b)
                .orElse("none configured");
    }

    private String getAllowedPriorities() {
        return priorityRepository.findAll().stream()
                .map(Priority::getName)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .reduce((a, b) -> a + ", " + b)
                .orElse("none configured");
    }
}
