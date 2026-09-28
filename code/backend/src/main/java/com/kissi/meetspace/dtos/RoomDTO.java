package com.kissi.meetspace.dtos;

import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
  private Long id;
  private String nom;
  private int capacite;
  private boolean actif;
  private String qrCodeUrl;
  private String localisation;
  private BuildingType building;
  private RoomType roomType;
  private Double mapX;
  private Double mapY;
  private List<EquipementDTO> equipements;
}