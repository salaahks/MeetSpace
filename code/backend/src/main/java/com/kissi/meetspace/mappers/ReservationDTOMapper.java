package com.kissi.meetspace.mappers;

import com.kissi.meetspace.dtos.ReservationDTO;
import com.kissi.meetspace.entities.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReservationDTOMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateMiseAJour", ignore = true)
    Reservation toEntity(ReservationDTO reservationDTO);

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "userId", source = "user.id")
    ReservationDTO toDto(Reservation reservation);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateMiseAJour", ignore = true)
    void updateEntityFromDto(ReservationDTO reservationDTO, @MappingTarget Reservation reservation);
}
