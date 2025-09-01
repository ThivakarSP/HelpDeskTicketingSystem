package com.examly.springapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketRequest {
    private String title;
    private String description;
    private String priority;
    private String category;
    private String reportedBy;
}
