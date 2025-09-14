package com.examly.springapp.dto;

public class CreateTicketRequest {
    private String title;
    private String description;
    // Legacy name-based fields (priority/category) OR new id-based fields priorityId/categoryId
    private String priority; // optional
    private String category; // optional
    private Long priorityId; // optional
    private Long categoryId; // optional
    private Long submitterId; // optional
    private Long assignedAgentId; // optional
    private String reportedBy;
    
    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getPriority() { return priority; }
    public String getCategory() { return category; }
    public String getReportedBy() { return reportedBy; }
    public Long getPriorityId() { return priorityId; }
    public Long getCategoryId() { return categoryId; }
    public Long getSubmitterId() { return submitterId; }
    public Long getAssignedAgentId() { return assignedAgentId; }
    
    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setCategory(String category) { this.category = category; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }
    public void setPriorityId(Long priorityId) { this.priorityId = priorityId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setSubmitterId(Long submitterId) { this.submitterId = submitterId; }
    public void setAssignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; }
}
