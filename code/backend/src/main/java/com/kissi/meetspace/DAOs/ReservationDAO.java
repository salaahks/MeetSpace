package com.kissi.meetspace.DAOs;

import com.kissi.meetspace.entities.Reservation;
import com.kissi.meetspace.enums.ReservationStatus;
import com.kissi.meetspace.repositories.ReservationRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ReservationDAO {
    private final ReservationRepository reservationRepository;

    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }
    public List<Reservation> getAll(){
        return reservationRepository.findAll();
    }
    public Reservation save(Reservation reservation){
        return reservationRepository.save(reservation);
    }
    public void deleteById(Long id){
        reservationRepository.deleteById(id);
    }
    public boolean checkRoomConflict(Long roomId,
                                     ReservationStatus status,
                                     LocalDateTime newStart,
                                     LocalDateTime newEnd){
        return reservationRepository.existsByRoom_IdAndStatusAndDateDebutReservationBeforeAndDateFinReservationAfter(roomId, status, newEnd,newStart);
    }
}
