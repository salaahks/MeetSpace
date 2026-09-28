package com.kissi.meetspace.services.impl;

import com.kissi.meetspace.dtos.UserDTO;
import com.kissi.meetspace.entities.User;
import com.kissi.meetspace.mappers.UserMapper;
import com.kissi.meetspace.repositories.UserRepository;
import com.kissi.meetspace.services.GraphUserService;
import com.kissi.meetspace.services.UserService;
import com.kissi.meetspace.services.abs.AbstractService;
import com.kissi.meetspace.utils.PasswordGenerator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends AbstractService implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final GraphUserService graphUserService;

    @Override
    public UserDTO getById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
    }

    @Override
    public Page<UserDTO> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDTO);
    }

    @Override
    public UserDTO findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + email));
    }

    @Override
    @Transactional
    public UserDTO create(UserDTO dto) {
        String password = PasswordGenerator.generate();
        String azureId = graphUserService.createAzureUser(dto, password);
        User user = userMapper.toEntity(dto);
        user.setAzureId(azureId);
        UserDTO result = userMapper.toDTO(userRepository.save(user));
        result.setTemporaryPassword(password);
        return result;
    }

    @Override
    @Transactional
    public UserDTO update(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
        if (user.getAzureId() != null) {
            graphUserService.updateAzureUser(user.getAzureId(), dto);
        }
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(entityName + " non trouve : " + id));
        if (user.getAzureId() != null) {
            graphUserService.deleteAzureUser(user.getAzureId());
        }
        userRepository.delete(user);
    }

    @Override
    public void setEntityName() {
        entityName = "User";
    }
}
