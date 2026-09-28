package com.kissi.meetspace.controllers;

import com.kissi.meetspace.constants.Endpoints;
import com.kissi.meetspace.dtos.RoomDTO;
import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import com.kissi.meetspace.services.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Endpoints.ROOMS)
@RequiredArgsConstructor
@Slf4j
public class RoomController {

  private final RoomService roomService;

  @GetMapping
  public ResponseEntity<List<RoomDTO>> getAll() {
    return new ResponseEntity<>(roomService.getAll(), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<RoomDTO> getById(@PathVariable Long id) {
    log.info("Get room by id : {}", id);
    return new ResponseEntity<>(roomService.getById(id), HttpStatus.OK);
  }

  @GetMapping("/actives")
  public ResponseEntity<List<RoomDTO>> getActives() {
    log.info("Get active rooms");
    return new ResponseEntity<>(roomService.getActives(), HttpStatus.OK);
  }

  @GetMapping("/filtrer")
  public ResponseEntity<List<RoomDTO>> getByFilters(
      @RequestParam RoomType roomType,
      @RequestParam Integer capaciteMin,
      @RequestParam BuildingType building) {
    log.info("Get rooms by filters");
    return new ResponseEntity<>(roomService.getByFilters(roomType, capaciteMin, building), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<RoomDTO> add(@RequestBody RoomDTO dto) {
    log.info("Create room : {}", dto.getNom());
    return new ResponseEntity<>(roomService.add(dto), HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseEntity<RoomDTO> update(
      @PathVariable Long id,
      @RequestBody RoomDTO dto) {
    log.info("Update room id : {}", id);
    return new ResponseEntity<>(roomService.update(id, dto), HttpStatus.OK);
  }

  @PatchMapping("/{id}/toggle-actif")
  public ResponseEntity<RoomDTO> toggleActif(@PathVariable Long id) {
    log.info("Toggle actif for room id : {}", id);
    return new ResponseEntity<>(roomService.toggleActif(id), HttpStatus.OK);
  }

  @PatchMapping("/{id}/map-position")
  public ResponseEntity<RoomDTO> updateMapPosition(
      @PathVariable Long id,
      @RequestParam Double mapX,
      @RequestParam Double mapY) {
    log.info("Update map position for room id : {} -> ({}, {})", id, mapX, mapY);
    return new ResponseEntity<>(roomService.updateMapPosition(id, mapX, mapY), HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    log.info("Delete room id : {}", id);
    roomService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}