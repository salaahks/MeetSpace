package com.kissi.meetspace.services.impl;

import com.kissi.meetspace.dtos.RoomDTO;
import com.kissi.meetspace.entities.Room;
import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import com.kissi.meetspace.mappers.RoomMapper;
import com.kissi.meetspace.repositories.RoomRepository;
import com.kissi.meetspace.services.abs.AbstractService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kissi.meetspace.services.RoomService;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl extends AbstractService implements RoomService{

  private final RoomRepository roomRepository;
  private final RoomMapper roomMapper;

  private static final String QR_CODE_BASE_URL = "/rooms/qr/";

  @Override
  public void setEntityName() {
    entityName = "Room";
  }

  @Override
  public RoomDTO getById(Long id) {
    return roomRepository.findById(id)
        .map(roomMapper::toDTO)
        .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
  }

  @Override
  public List<RoomDTO> getAll() {
    return roomRepository.findAll()
        .stream()
        .map(roomMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<RoomDTO> getActives() {
    return roomRepository.findByActifTrue()
        .stream()
        .map(roomMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public List<RoomDTO> getByFilters(RoomType roomType, Integer capaciteMin, BuildingType building) {
    return roomRepository.findByFilters(roomType, capaciteMin, building)
        .stream()
        .map(roomMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public RoomDTO add(RoomDTO dto) {
    if (roomRepository.existsByNomIgnoreCase(dto.getNom())) {
      throw new IllegalArgumentException(entityName + " avec le nom '" + dto.getNom() + "' existe déjà.");
    }
    Room room = roomMapper.toEntity(dto);
    room.setQrCodeUrl(generateQrCodeUrl());
    return roomMapper.toDTO(roomRepository.save(room));
  }

  @Override
  @Transactional
  public RoomDTO update(Long id, RoomDTO dto) {
    Room room = roomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    if (roomRepository.existsByNomIgnoreCaseAndIdNot(dto.getNom(), id)) {
      throw new IllegalArgumentException(entityName + " avec le nom '" + dto.getNom() + "' existe déjà.");
    }
    roomMapper.updateEntityFromDTO(dto, room);
    return roomMapper.toDTO(roomRepository.save(room));
  }

  @Override
  @Transactional
  public RoomDTO toggleActif(Long id) {
    Room room = roomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    room.setActif(!room.isActif());
    return roomMapper.toDTO(roomRepository.save(room));
  }

  @Override
  @Transactional
  public RoomDTO updateMapPosition(Long id, Double mapX, Double mapY) {
    Room room = roomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    room.setMapX(mapX);
    room.setMapY(mapY);
    return roomMapper.toDTO(roomRepository.save(room));
  }

  @Override
  @Transactional
  public void deleteById(Long id) {
    Room room = roomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    roomRepository.delete(room);
  }

  // ─── Privé ───────────────────────────────────────────────────────────────

  private String generateQrCodeUrl() {
    return QR_CODE_BASE_URL + UUID.randomUUID();
  }
}