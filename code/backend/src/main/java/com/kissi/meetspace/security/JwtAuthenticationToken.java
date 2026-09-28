package com.kissi.meetspace.security;

import com.kissi.meetspace.dtos.user.CurrentUser;
import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Transient;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.AbstractOAuth2TokenAuthenticationToken;

@Transient
public class JwtAuthenticationToken extends AbstractOAuth2TokenAuthenticationToken<Jwt> {

  private final String name;

  public JwtAuthenticationToken(Jwt jwt, CurrentUser principal,
      Collection<? extends GrantedAuthority> authorities, String name) {
    super(jwt, principal, jwt, authorities);
    this.setAuthenticated(true);
    this.name = name;
  }

  public Map<String, Object> getTokenAttributes() {
    return this.getToken().getClaims();
  }

  @Override
  public String getName() {
    return this.name;
  }
}
