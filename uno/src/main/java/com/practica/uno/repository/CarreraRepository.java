package com.practica.uno.repository;

import com.practica.uno.entity.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarreraRepository extends JpaRepository<Carrera, Long> {

    boolean existsByNombreIgnoreCaseAndDivisionId(String nombre, Long divisionId);

    boolean existsByNombreIgnoreCaseAndDivisionIdAndIdNot(String nombre, Long divisionId, Long id);
}
