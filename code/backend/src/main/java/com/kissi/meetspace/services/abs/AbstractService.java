package com.kissi.meetspace.services.abs;

import jakarta.annotation.PostConstruct;

public abstract class AbstractService {
  protected String entityName;

  @PostConstruct
  public void init(){
    setEntityName();
  }

  public abstract void setEntityName();
}