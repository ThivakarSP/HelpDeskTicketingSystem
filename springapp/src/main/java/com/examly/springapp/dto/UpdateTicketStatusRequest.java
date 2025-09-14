package com.examly.springapp.dto;

public class UpdateTicketStatusRequest {
    private String status;
    private String comment;
    
    // Getters
    public String getStatus() { return status; }
    public String getComment() { return comment; }
    
    // Setters
    public void setStatus(String status) { this.status = status; }
    public void setComment(String comment) { this.comment = comment; }
}
