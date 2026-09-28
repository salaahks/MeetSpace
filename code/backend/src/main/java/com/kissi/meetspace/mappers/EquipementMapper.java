package com.kissi.meetspace.mappers;

import com.kissi.meetspace.dtos.EquipementDTO;
import com.kissi.meetspace.entities.Equipement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EquipementMapper {

    @Mapping(target = "roomId", source = "room.id")
    EquipementDTO toDTO(Equipement equipement);

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Equipement toEntity(EquipementDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(EquipementDTO dto, @MappingTarget Equipement equipement);
}
