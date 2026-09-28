package com.kissi.meetspace.controllers;

import com.kissi.meetspace.constants.Endpoints;
import com.kissi.meetspace.dtos.ReservationDTO;
import com.kissi.meetspace.services.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Endpoints.RESERVATIONS)
@RequiredArgsConstructor
@Slf4j
public class ReservationController {
    private final ReservationService reservationService;
    @GetMapping
    @ResponseStatus(value = HttpStatus.OK)
    public List<ReservationDTO> getAllReservations(){
        log.info("GET request to fetch all reservations");
        return reservationService.getAll();
    }
    @GetMapping("/{id}")
    @ResponseStatus(value = HttpStatus.OK)
    public ReservationDTO getReservationById(@PathVariable Long id){
        log.info("Get request to fetch reservation with id: {}", id);
        return reservationService.getById(id);
    }
    @PostMapping
    @ResponseStatus(value = HttpStatus.CREATED)
    public ReservationDTO createReservation(@RequestBody @Valid ReservationDTO reservationDTO){
        log.info("Create Reservation");
        ReservationDTO created = reservationService.add(reservationDTO);
        log.info("Reservation was created successfully");
        return created;
    }
    @PutMapping("/{id}")
    @ResponseStatus(value = HttpStatus.OK)
    public ReservationDTO updateReservation(@PathVariable Long id, @RequestBody @Valid ReservationDTO reservationDTO){
        log.info("Put request to update reservation with id: {}", id);
        ReservationDTO updated =  reservationService.update(id,reservationDTO);
        log.info("Reservation with id: {} updated successfully", id);
        return updated;
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteReservation(@PathVariable Long id){
        log.info("Delete request to delete reservation with id: {}", id);
        reservationService.deleteById(id);
        log.info("Reservation with id: {} deleted successfully", id);
    }
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ReservationDTO> confirmReservationById(@PathVariable Long id){
        log.info("confirm reservation with id: {}", id);
        ReservationDTO confirmedReservation = reservationService.confirmReservationById(id);
        log.info("Reservation with id: {} was confirmed successfully", id);
        return ResponseEntity.ok(confirmedReservation);
    }
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservationDTO> cancelReservationById(@PathVariable Long id){
        log.info("cancel reservation with id: {}", id);
        ReservationDTO cancelledReservation = reservationService.cancelReservationById(id);
        log.info("Reservation with id: {} was cancelled successfully", id);
        return ResponseEntity.ok(cancelledReservation);
    }
}
