package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TicketStatus {
    New("New"), 
    In_Progress("In Progress"), 
    Resolved("Resolved"), 
    Closed("Closed");
    
    private final String value;
    
    TicketStatus(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @Override
    public String toString() {
        return value;
    }

    public static TicketStatus fromString(String raw) {
        if (raw == null) throw new IllegalArgumentException("Status value is required");
        String norm = raw.trim().toUpperCase().replace('-', '_').replace(' ', '_');
        // Accept common synonyms: OPEN -> New, INPROGRESS -> In_Progress
        if (norm.equals("OPEN")) return New;
        if (norm.equals("INPROGRESS")) return In_Progress;
        // Try direct enum name match
        for (TicketStatus s : values()) {
            if (s.name().toUpperCase().equals(norm)) return s;
        }
        // Try display value match ignoring case/spaces
        String compact = raw.replaceAll("[ _-]", "").toLowerCase();
        for (TicketStatus s : values()) {
            String dispCompact = s.getValue().replaceAll("[ _-]", "").toLowerCase();
            if (dispCompact.equals(compact)) return s;
        }
        throw new IllegalArgumentException("Invalid status: " + raw + ". Allowed: " + allowedList());
    }

    public static String allowedList() {
        return "New, In_Progress (In Progress), Resolved, Closed (aliases: OPEN=>New, INPROGRESS=>In_Progress)";
    }
}
