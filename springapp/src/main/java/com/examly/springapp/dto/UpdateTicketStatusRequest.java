package com.examly.springapp.dto;

import com.examly.springapp.model.TicketStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;

public class UpdateTicketStatusRequest {
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private String comment;
    
    public UpdateTicketStatusRequest() {
    }
    
    public UpdateTicketStatusRequest(String status) {
        this.status = status;
    }
    
    public UpdateTicketStatusRequest(String status, String comment) {
        this.status = status;
        this.comment = comment;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    @JsonIgnore
    public TicketStatus getStatusEnum() {
        try {
            return TicketStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED");
        }
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
}
