package com.kissi.meetspace.services;

import com.kissi.meetspace.dtos.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDTO getById(Long id);
    Page<UserDTO> getAll(Pageable pageable);
    UserDTO findByEmail(String email);
    UserDTO create(UserDTO dto);
    UserDTO update(Long id, UserDTO dto);
    void delete(Long id);
}
