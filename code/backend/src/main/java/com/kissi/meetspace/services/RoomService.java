package com.kissi.meetspace.services;

import com.kissi.meetspace.dtos.RoomDTO;
import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import com.kissi.meetspace.services.abs.CrudService;


import java.util.List;

public interface  RoomService extends CrudService<RoomDTO> {

  List<RoomDTO> getActives();

  List<RoomDTO> getByFilters(RoomType roomType, Integer capaciteMin, BuildingType building);

  RoomDTO toggleActif(Long id);

  RoomDTO updateMapPosition(Long id, Double mapX, Double mapY);

}