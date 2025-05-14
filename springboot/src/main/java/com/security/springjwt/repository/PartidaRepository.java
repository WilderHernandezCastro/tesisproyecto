package com.security.springjwt.repository;

import com.security.springjwt.models.Partida;
import com.security.springjwt.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {
    List<Partida> findByUsuario(User usuario);

}
