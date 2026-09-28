package com.kissi.meetspace.services.impl;

import com.kissi.meetspace.dtos.EquipementDTO;
import com.kissi.meetspace.entities.Equipement;
import com.kissi.meetspace.entities.Room;
import com.kissi.meetspace.enums.EquipementType;
import com.kissi.meetspace.mappers.EquipementMapper;
import com.kissi.meetspace.repositories.EquipementRepository;
import com.kissi.meetspace.repositories.RoomRepository;
import com.kissi.meetspace.services.EquipementService;
import com.kissi.meetspace.services.abs.AbstractService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EquipementServiceImpl extends AbstractService implements EquipementService {

    private final EquipementRepository equipementRepository;
    private final EquipementMapper equipementMapper;
    private final RoomRepository roomRepository;

    @Override
    public void setEntityName() {
        entityName = "Equipement";
    }

    @Override
    public EquipementDTO getById(Long id) {
        return equipementRepository.findById(id)
                .map(equipementMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    }

    @Override
    public List<EquipementDTO> getAll() {
        return equipementRepository.findAll()
                .stream()
                .map(equipementMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipementDTO> getByRoomId(Long roomId) {
        return equipementRepository.findByRoom_Id(roomId)
                .stream()
                .map(equipementMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipementDTO> getByType(EquipementType equipementType) {
        return equipementRepository.findByEquipementType(equipementType)
                .stream()
                .map(equipementMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EquipementDTO add(EquipementDTO dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room non trouvee : " + dto.getRoomId()));
        Equipement equipement = equipementMapper.toEntity(dto);
        equipement.setRoom(room);
        return equipementMapper.toDTO(equipementRepository.save(equipement));
    }

    @Override
    @Transactional
    public EquipementDTO update(Long id, EquipementDTO dto) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room non trouvee : " + dto.getRoomId()));
        equipementMapper.updateEntityFromDTO(dto, equipement);
        equipement.setRoom(room);
        return equipementMapper.toDTO(equipementRepository.save(equipement));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
        equipementRepository.delete(equipement);
    }
}
