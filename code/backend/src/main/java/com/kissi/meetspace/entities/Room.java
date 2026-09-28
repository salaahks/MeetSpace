package com.kissi.meetspace.entities;

import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private int capacite;

    private boolean actif;

    private String qrCodeUrl;

    private String localisation;

    @Enumerated(EnumType.STRING)
    private BuildingType building;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    private Double mapX;

    private Double mapY;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Equipement> equipements;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;
}