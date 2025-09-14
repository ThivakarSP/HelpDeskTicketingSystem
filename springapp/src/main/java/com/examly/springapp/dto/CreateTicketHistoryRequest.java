package com.examly.springapp.dto;

public class CreateTicketHistoryRequest {
    private String comment;
    private String statusChangeFrom;
    private String statusChangeTo;
    private Long ticketId;
    private Long userId;

    // Constructors
    public CreateTicketHistoryRequest() {}

    public CreateTicketHistoryRequest(String comment, String statusChangeFrom, String statusChangeTo, Long ticketId, Long userId) {
        this.comment = comment;
        this.statusChangeFrom = statusChangeFrom;
        this.statusChangeTo = statusChangeTo;
        this.ticketId = ticketId;
        this.userId = userId;
    }

    // Getters and Setters
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStatusChangeFrom() {
        return statusChangeFrom;
    }

    public void setStatusChangeFrom(String statusChangeFrom) {
        this.statusChangeFrom = statusChangeFrom;
    }

    public String getStatusChangeTo() {
        return statusChangeTo;
    }

    public void setStatusChangeTo(String statusChangeTo) {
        this.statusChangeTo = statusChangeTo;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}