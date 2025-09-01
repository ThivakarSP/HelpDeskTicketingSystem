package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> { }
