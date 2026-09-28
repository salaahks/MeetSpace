package com.kissi.meetspace.repositories;

import com.kissi.meetspace.entities.Reservation;
import com.kissi.meetspace.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByRoom_IdAndStatusAndDateDebutReservationBeforeAndDateFinReservationAfter(
            Long roomId,
            ReservationStatus status,
            LocalDateTime newEnd,
            LocalDateTime newStart
    );
}
