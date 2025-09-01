package com.examly.springapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTicketStatusRequest {
    private String status;
    private String comment;
}
