package com.security.springjwt.repository;

import com.security.springjwt.models.Juego;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JuegoRepository extends JpaRepository<Juego, Long> {

    List<Juego> findByNombreContaining(String nombre);

}
