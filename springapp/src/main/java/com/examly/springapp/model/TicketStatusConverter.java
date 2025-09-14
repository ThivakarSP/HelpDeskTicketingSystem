package com.examly.springapp.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class TicketStatusConverter implements AttributeConverter<TicketStatus, String> {

    @Override
    public String convertToDatabaseColumn(TicketStatus ticketStatus) {
        if (ticketStatus == null) {
            return null;
        }
        return ticketStatus.getValue();
    }

    @Override
    public TicketStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        switch (dbData) {
            case "New":
                return TicketStatus.New;
            case "In Progress":
                return TicketStatus.In_Progress;
            case "Resolved":
                return TicketStatus.Resolved;
            case "Closed":
                return TicketStatus.Closed;
            default:
                throw new IllegalArgumentException("Unknown status: " + dbData);
        }
    }
}