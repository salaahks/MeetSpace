package com.kissi.meetspace.controllers;

import com.kissi.meetspace.constants.Endpoints;
import com.kissi.meetspace.dtos.EquipementDTO;
import com.kissi.meetspace.enums.EquipementType;
import com.kissi.meetspace.services.EquipementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Endpoints.EQUIPEMENTS)
@RequiredArgsConstructor
@Slf4j
public class EquipementController {

    private final EquipementService equipementService;

    @GetMapping
    public ResponseEntity<List<EquipementDTO>> getAll() {
        return new ResponseEntity<>(equipementService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipementDTO> getById(@PathVariable Long id) {
        log.info("Get equipement by id : {}", id);
        return new ResponseEntity<>(equipementService.getById(id), HttpStatus.OK);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<EquipementDTO>> getByRoomId(@PathVariable Long roomId) {
        log.info("Get equipements for room id : {}", roomId);
        return new ResponseEntity<>(equipementService.getByRoomId(roomId), HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<EquipementDTO>> getByType(@PathVariable EquipementType type) {
        log.info("Get equipements by type : {}", type);
        return new ResponseEntity<>(equipementService.getByType(type), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<EquipementDTO> add(@RequestBody EquipementDTO dto) {
        log.info("Create equipement : {}", dto.getName());
        return new ResponseEntity<>(equipementService.add(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipementDTO> update(@PathVariable Long id, @RequestBody EquipementDTO dto) {
        log.info("Update equipement id : {}", id);
        return new ResponseEntity<>(equipementService.update(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Delete equipement id : {}", id);
        equipementService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
