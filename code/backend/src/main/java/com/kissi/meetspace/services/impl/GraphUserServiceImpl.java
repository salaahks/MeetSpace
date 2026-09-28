package com.kissi.meetspace.services.impl;

import com.microsoft.graph.models.PasswordProfile;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import com.microsoft.kiota.ApiException;
import com.kissi.meetspace.dtos.UserDTO;
import com.kissi.meetspace.services.GraphUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GraphUserServiceImpl implements GraphUserService {

    private final GraphServiceClient graphServiceClient;

    @Value("${azure.graph.domain}")
    private String tenantDomain;

    @Override
    public List<UserDTO> listAzureUsers() {
        try {
            return Objects.requireNonNull(graphServiceClient.users().get()).getValue()
                    .stream()
                    .map(u -> UserDTO.builder()
                            .azureId(u.getId())
                            .fullName(u.getDisplayName())
                            .email(u.getUserPrincipalName())
                            .build())
                    .collect(Collectors.toList());
        } catch (ApiException e) {
            log.error("Graph API error listing users: {}", e.getMessage());
            throw new RuntimeException("Impossible de récupérer les utilisateurs Azure AD : " + e.getMessage());
        }
    }

    @Override
    public String createAzureUser(UserDTO dto, String password) {
        try {
            String upn = buildUpn(dto.getEmail());
            String nickname = upn.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");

            com.microsoft.graph.models.User azureUser = new com.microsoft.graph.models.User();
            azureUser.setDisplayName(dto.getFirstName() + " " + dto.getLastName());
            azureUser.setGivenName(dto.getFirstName());
            azureUser.setSurname(dto.getLastName());
            azureUser.setMailNickname(nickname);
            azureUser.setUserPrincipalName(upn);
            azureUser.setAccountEnabled(true);

            PasswordProfile passwordProfile = new PasswordProfile();
            passwordProfile.setForceChangePasswordNextSignIn(true);
            passwordProfile.setPassword(password);
            azureUser.setPasswordProfile(passwordProfile);

            com.microsoft.graph.models.User created = graphServiceClient.users().post(azureUser);
            String azureId = Objects.requireNonNull(created).getId();
            log.info("Azure AD user created: {} ({})", upn, azureId);
            return azureId;
        } catch (ApiException e) {
            log.error("Graph API error creating user: {}", e.getMessage());
            throw new RuntimeException("Impossible de créer l'utilisateur Azure AD : " + e.getMessage());
        }
    }

    @Override
    public void deleteAzureUser(String azureId) {
        try {
            graphServiceClient.users().byUserId(azureId).delete();
            log.info("Azure AD user deleted: {}", azureId);
        } catch (ApiException e) {
            log.error("Graph API error deleting user {}: {}", azureId, e.getMessage());
            throw new RuntimeException("Impossible de supprimer l'utilisateur Azure AD : " + e.getMessage());
        }
    }

    @Override
    public void updateAzureUser(String azureId, UserDTO dto) {
        try {
            com.microsoft.graph.models.User azureUser = new com.microsoft.graph.models.User();
            azureUser.setDisplayName(dto.getFirstName() + " " + dto.getLastName());
            azureUser.setGivenName(dto.getFirstName());
            azureUser.setSurname(dto.getLastName());
            graphServiceClient.users().byUserId(azureId).patch(azureUser);
            log.info("Azure AD user updated: {}", azureId);
        } catch (ApiException e) {
            log.error("Graph API error updating user {}: {}", azureId, e.getMessage());
            throw new RuntimeException("Impossible de modifier l'utilisateur Azure AD : " + e.getMessage());
        }
    }

    private String buildUpn(String email) {
        if (email != null && email.contains("@")) {
            return email;
        }
        return email + "@" + tenantDomain;
    }
}
