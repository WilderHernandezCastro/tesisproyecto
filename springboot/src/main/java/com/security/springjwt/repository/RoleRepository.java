package com.security.springjwt.repository;

import java.util.Optional;

import com.security.springjwt.models.ERole;
import com.security.springjwt.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);
}
