package com.kissi.meetspace.repositories;

import com.kissi.meetspace.entities.Equipement;
import com.kissi.meetspace.enums.EquipementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {

    List<Equipement> findByRoom_Id(Long roomId);

    List<Equipement> findByEquipementType(EquipementType equipementType);
}
