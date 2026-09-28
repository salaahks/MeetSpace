package com.kissi.meetspace.services;

import com.kissi.meetspace.dtos.EquipementDTO;
import com.kissi.meetspace.enums.EquipementType;
import com.kissi.meetspace.services.abs.CrudService;

import java.util.List;

public interface EquipementService extends CrudService<EquipementDTO> {

    List<EquipementDTO> getByRoomId(Long roomId);

    List<EquipementDTO> getByType(EquipementType equipementType);
}
