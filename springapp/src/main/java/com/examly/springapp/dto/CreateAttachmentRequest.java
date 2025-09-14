package com.examly.springapp.dto;

public class CreateAttachmentRequest {
    private String fileName;
    private String fileUrl;
    private Long ticketId;
    private Long userId;

    // Constructors
    public CreateAttachmentRequest() {}

    public CreateAttachmentRequest(String fileName, String fileUrl, Long ticketId, Long userId) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.ticketId = ticketId;
        this.userId = userId;
    }

    // Getters and Setters
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
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