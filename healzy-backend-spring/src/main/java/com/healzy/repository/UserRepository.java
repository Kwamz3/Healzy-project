package com.healzy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healzy.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByEmail(String email);
}