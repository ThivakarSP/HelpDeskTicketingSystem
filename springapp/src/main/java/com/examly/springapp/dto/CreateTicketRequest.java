package com.examly.springapp.dto;

import com.examly.springapp.model.TicketCategory;
import com.examly.springapp.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateTicketRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Priority is required")
    private TicketPriority priority;
    
    @NotNull(message = "Category is required")
    private TicketCategory category;
    
    @NotBlank(message = "Reported by is required")
    @Size(max = 100, message = "Reported by must not exceed 100 characters")
    private String reportedBy;
    
    public CreateTicketRequest() {
    }
    
    public CreateTicketRequest(String title, String description, TicketPriority priority, TicketCategory category, String reportedBy) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.reportedBy = reportedBy;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TicketPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
    
    public TicketCategory getCategory() {
        return category;
    }
    
    public void setCategory(TicketCategory category) {
        this.category = category;
    }
    
    public String getReportedBy() {
        return reportedBy;
    }
    
    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }
}
