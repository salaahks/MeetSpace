package com.kissi.meetspace.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CurrentUser {
  private String userName;
  private String firstName;
  private String lastName;
  private String email;
  private String role;
}
