package com.kissi.meetspace.services.impl;

import com.kissi.meetspace.DAOs.ReservationDAO;
import com.kissi.meetspace.entities.Room;
import com.kissi.meetspace.entities.User;
import com.kissi.meetspace.mappers.ReservationDTOMapper;
import com.kissi.meetspace.dtos.ReservationDTO;
import com.kissi.meetspace.entities.Reservation;
import com.kissi.meetspace.enums.ReservationStatus;
import com.kissi.meetspace.exceptions.ReservationNotFound;
import com.kissi.meetspace.exceptions.RoomAlreadyBookedException;
import com.kissi.meetspace.repositories.RoomRepository;
import com.kissi.meetspace.repositories.UserRepository;
import com.kissi.meetspace.services.ReservationService;
import com.kissi.meetspace.services.abs.AbstractService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationServiceImpl extends AbstractService implements ReservationService {
    private final ReservationDAO reservationDAO;
    private final ReservationDTOMapper reservationDTOMapper;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
  // TODO: Inject RoomRepository and UserRepository or DAO
    //TODO: manage Authorization
    @Override
    public void setEntityName() {
        this.entityName = "Reservation";
    }
    @Override
    public List<ReservationDTO> getAll(){
        log.debug("Fetching all reservations from database");
        return reservationDAO.getAll().stream()
                .map(reservationDTOMapper::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public ReservationDTO add(ReservationDTO reservationDTO){
        log.debug("Create reservation");
        boolean isConflict = reservationDAO.checkRoomConflict(reservationDTO.roomId(),
                ReservationStatus.CONFIRME,
                reservationDTO.dateDebutReservation(),
                reservationDTO.dateFinReservation()
        );
        if (isConflict) {
            throw new RoomAlreadyBookedException("This room is already booked for the selected time.");
        }

      Reservation reservation = reservationDTOMapper.toEntity(reservationDTO);
      //TODO: force the reservation type to EN_ATTENTE
      Room room = roomRepository.findById(reservationDTO.roomId())
          .orElseThrow(() -> new EntityNotFoundException("Room non trouvee : " + reservationDTO.roomId()));
      User user = userRepository.findById(reservationDTO.userId())
          .orElseThrow(() -> new EntityNotFoundException("User non trouve : " + reservationDTO.userId()));

      reservation.setRoom(room);
      reservation.setUser(user);
      reservation.setStatus(ReservationStatus.EN_ATTENTE);

        return reservationDTOMapper.toDto(reservationDAO.save(reservation));
    }
    @Override
    public ReservationDTO update(Long id, ReservationDTO reservationDTO){
        log.debug("Update reservation");
        boolean isConflict = reservationDAO.checkRoomConflict(reservationDTO.roomId(),
                ReservationStatus.CONFIRME,
                reservationDTO.dateDebutReservation(),
                reservationDTO.dateFinReservation()
        );
        if (isConflict) {
            throw new RoomAlreadyBookedException("This room is already booked for the selected time.");
        }
        Reservation existingReservation =reservationDAO.findById(id)
                .orElseThrow(()->new ReservationNotFound("Cannot find " + entityName + " with id: " + id));

      reservationDTOMapper.updateEntityFromDto(reservationDTO, existingReservation);
      Room room = roomRepository.findById(reservationDTO.roomId())
          .orElseThrow(() -> new EntityNotFoundException("Room non trouvee : " + reservationDTO.roomId()));
      User user = userRepository.findById(reservationDTO.userId())
          .orElseThrow(() -> new EntityNotFoundException("User non trouve : " + reservationDTO.userId()));

      existingReservation.setRoom(room);
      existingReservation.setUser(user);

        return reservationDTOMapper.toDto(reservationDAO.save(existingReservation));
    }
    @Override
    public ReservationDTO getById(Long id){
        log.debug("Fetch reservation by id: {}",id);
        var reservation = reservationDAO.findById(id)
                .orElseThrow(() -> new ReservationNotFound("Cannot find " + entityName + " with id: " + id));
        return reservationDTOMapper.toDto(reservation);
    }
    @Override
    public void deleteById(Long id){
        log.debug("Delete reservation by id: {}",id);
        reservationDAO.deleteById(id);
    }
    //User actions
    @Override
    public ReservationDTO cancelReservationById(Long id){
        Reservation existingReservation = reservationDAO.findById(id)
                .orElseThrow(() -> new ReservationNotFound("Cannot find " + entityName + " with id: " + id));
        existingReservation.setStatus(ReservationStatus.ANNULE);
        Reservation cancelledReservation = reservationDAO.save(existingReservation);
        log.info("Reservation was cancelled successfully");
        return reservationDTOMapper.toDto(cancelledReservation);
    }
    @Override
    public ReservationDTO confirmReservationById(Long id){
        Reservation existingReservation = reservationDAO.findById(id)
                .orElseThrow(() -> new ReservationNotFound("Cannot find " + entityName + " with id: " + id));
        if (existingReservation.getStatus() == ReservationStatus.ANNULE) {
            throw new IllegalStateException("Cannot confirm a cancelled reservation");
        }
        existingReservation.setStatus(ReservationStatus.CONFIRME);
        Reservation confirmedReservation = reservationDAO.save(existingReservation);
        log.info("Reservation was confirmed successfully");
        return reservationDTOMapper.toDto(confirmedReservation);
    }
}
