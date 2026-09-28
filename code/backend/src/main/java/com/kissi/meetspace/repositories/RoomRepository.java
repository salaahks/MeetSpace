package com.kissi.meetspace.repositories;

import com.kissi.meetspace.entities.Room;
import com.kissi.meetspace.enums.BuildingType;
import com.kissi.meetspace.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface  RoomRepository extends JpaRepository<Room, Long> {

  List<Room> findByActifTrue();

  boolean existsByNomIgnoreCase(String nom);

  boolean existsByNomIgnoreCaseAndIdNot(String nom,Long id);

  @Query("SELECT r FROM Room r WHERE r.actif = true " +
      "AND (:roomType IS NULL OR r.roomType = :roomType) " +
      "AND (:capaciteMin IS NULL OR r.capacite >= :capaciteMin) " +
      "AND (:building IS NULL OR r.building = :building)")
  List<Room> findByFilters(
      @Param("roomType") RoomType roomType,
      @Param("capaciteMin") Integer capaciteMin,
      @Param("building") BuildingType building
  );


}