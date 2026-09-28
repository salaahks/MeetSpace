package com.kissi.meetspace.services;

import com.kissi.meetspace.dtos.UserDTO;
import java.util.List;

public interface GraphUserService {
    List<UserDTO> listAzureUsers();
    String createAzureUser(UserDTO dto, String password);
    void deleteAzureUser(String azureId);
    void updateAzureUser(String azureId, UserDTO dto);
}
