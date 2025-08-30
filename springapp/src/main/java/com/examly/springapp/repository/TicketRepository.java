package com.examly.springapp.repository;

import com.examly.springapp.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // JpaRepository provides all basic CRUD operations
    // Additional custom queries can be added here if needed
}
