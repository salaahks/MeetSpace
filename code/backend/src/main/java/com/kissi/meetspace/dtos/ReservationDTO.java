package com.kissi.meetspace.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReservationDTO(
        @NotNull LocalDateTime dateDebutReservation,
        @NotNull @Future LocalDateTime dateFinReservation,
        @Min(1) int nombreParticipants,
        @NotNull Long roomId,
        @NotNull Long userId) {
}
