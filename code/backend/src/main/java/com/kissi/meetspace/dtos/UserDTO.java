package com.kissi.meetspace.dtos;

import com.kissi.meetspace.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
  private Long id;
  private String azureId;
  private String firstName;
  private String lastName;
  private String fullName;
  private String cin;
  private String phone;
  private String address;
  private String email;
  private UserRole role;
  private String temporaryPassword;
}
