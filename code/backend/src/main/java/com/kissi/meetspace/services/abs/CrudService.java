package com.kissi.meetspace.services.abs;



import java.util.List;

public interface CrudService<T> {
  T getById(Long id);
  List<T> getAll();
  T add(T dto);
  T update(Long id, T dto);
  void deleteById(Long id);
}
