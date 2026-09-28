package com.kissi.meetspace.mappers;

import com.kissi.meetspace.dtos.UserDTO;
import com.kissi.meetspace.entities.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "fullName",
      expression = "java(user.getFirstName() + \" \" + user.getLastName())")
  UserDTO toDTO(User user);

  @Mapping(target = "reservations", ignore = true)
  User toEntity(UserDTO dto);
}