package com.examly.springapp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Relational priority (FK priorities.id)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "priority_id")
    private Priority priority;

    // Relational category (FK categories.id)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    // Submitter (FK users.id)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submitter_id")
    private User submitter;

    // Assigned agent (FK users.id) nullable
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;
    
    @Convert(converter = TicketStatusConverter.class)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.New;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Backward-compatible JSON fields exposing names instead of nested objects
    @JsonProperty("priority")
    public String getPriorityName() {
        return priority != null ? priority.getName() : null;
    }

    @JsonProperty("category")
    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }
}
