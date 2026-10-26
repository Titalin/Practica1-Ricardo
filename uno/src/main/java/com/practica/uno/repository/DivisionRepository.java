package com.practica.uno.repository;

import com.practica.uno.entity.Division;
import com.practica.uno.entity.EstadoAprobacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DivisionRepository extends JpaRepository<Division, Long> {

    List<Division> findByEstado(EstadoAprobacion estado);
}
