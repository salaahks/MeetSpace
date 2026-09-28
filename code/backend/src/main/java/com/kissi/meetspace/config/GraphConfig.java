package com.kissi.meetspace.config;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.serviceclient.GraphServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfig {

    @Value("${azure.graph.tenant-id}")
    private String tenantId;

    @Value("${azure.graph.client-id}")
    private String clientId;

    @Value("${azure.graph.client-secret}")
    private String clientSecret;

    @Bean
    public GraphServiceClient graphServiceClient() {
        ClientSecretCredential credential = new ClientSecretCredentialBuilder()
                .tenantId(tenantId)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();

        return new GraphServiceClient(credential, "https://graph.microsoft.com/.default");
    }
}
