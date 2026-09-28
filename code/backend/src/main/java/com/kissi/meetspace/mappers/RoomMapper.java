package com.kissi.meetspace.mappers;


import com.kissi.meetspace.dtos.RoomDTO;
import com.kissi.meetspace.entities.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring", uses = {EquipementMapper.class})
public interface RoomMapper {

  @Mapping(target = "equipements", source = "equipements")
  RoomDTO toDTO(Room room);

  @Mapping(target = "equipements", ignore = true)
  @Mapping(target = "reservations", ignore = true)
  Room toEntity(RoomDTO dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "qrCodeUrl", ignore = true)
  @Mapping(target = "equipements", ignore = true)
  @Mapping(target = "reservations", ignore = true)
  void updateEntityFromDTO(RoomDTO dto, @MappingTarget Room room);
}