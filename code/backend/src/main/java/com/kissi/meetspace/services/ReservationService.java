package com.kissi.meetspace.services;

import com.kissi.meetspace.dtos.ReservationDTO;
import com.kissi.meetspace.services.abs.CrudService;


public interface ReservationService extends CrudService<ReservationDTO> {
    public ReservationDTO cancelReservationById(Long id);
    public ReservationDTO confirmReservationById(Long id);
}
