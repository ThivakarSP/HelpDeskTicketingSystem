package com.examly.springapp.dto;

import com.examly.springapp.model.TicketCategory;
import com.examly.springapp.model.TicketPriority;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTicketRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Priority is required")
    private String priority;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Reported by is required")
    @Size(max = 100, message = "Reported by must not exceed 100 characters")
    private String reportedBy;
    
    public CreateTicketRequest() {
    }
    
    public CreateTicketRequest(String title, String description, String priority, String category, String reportedBy) {
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
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    @JsonIgnore
    public TicketPriority getPriorityEnum() {
        try {
            return TicketPriority.valueOf(priority);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Priority must be one of: HIGH, MEDIUM, LOW");
        }
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    @JsonIgnore
    public TicketCategory getCategoryEnum() {
        try {
            return TicketCategory.valueOf(category);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Category must be one of: HARDWARE, SOFTWARE, NETWORK, OTHER");
        }
    }
    
    public String getReportedBy() {
        return reportedBy;
    }
    
    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }
}
