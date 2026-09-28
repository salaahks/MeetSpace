package com.kissi.meetspace.dtos;

import com.kissi.meetspace.enums.EquipementType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipementDTO {
    private Long id;
    private String name;
    private int quantity;
    private EquipementType equipementType;
    private Long roomId;
}
