package com.examly.springapp.dto;

import com.examly.springapp.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTicketStatusRequest {
    
    @NotNull(message = "Status is required")
    private TicketStatus status;
    
    private String comment;
    
    public UpdateTicketStatusRequest() {
    }
    
    public UpdateTicketStatusRequest(TicketStatus status) {
        this.status = status;
    }
    
    public UpdateTicketStatusRequest(TicketStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }
    
    public TicketStatus getStatus() {
        return status;
    }
    
    public void setStatus(TicketStatus status) {
        this.status = status;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
}
