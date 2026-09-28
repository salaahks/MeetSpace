package com.kissi.meetspace.security;

import com.kissi.meetspace.dtos.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(Jwt jwt) {
    if (jwt == null) {
      return null;
    }

    CurrentUser currentUser = CurrentUser.builder()
        .userName(jwt.getClaim("preferred_username") != null
            ? jwt.getClaim("preferred_username").toString() : null)
        .firstName(jwt.getClaim("given_name") != null
            ? jwt.getClaim("given_name").toString() : null)
        .lastName(jwt.getClaim("family_name") != null
            ? jwt.getClaim("family_name").toString() : null)
        .email(jwt.getClaim("preferred_username") != null
            ? jwt.getClaim("preferred_username").toString() : null)
        .build();

    log.info("User connected: {}", currentUser.getUserName());

    return new JwtAuthenticationToken(
        jwt,
        currentUser,
        null,
        jwt.getClaim("preferred_username")
    );
  }
}