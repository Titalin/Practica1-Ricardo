package com.practica.uno.service;

import com.practica.uno.dto.DivisionResponse;
import com.practica.uno.dto.EstadoResponse;
import com.practica.uno.entity.Division;
import com.practica.uno.entity.EstadoAprobacion;
import com.practica.uno.repository.DivisionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
public class AprobacionService {

    private final DivisionRepository divisionRepository;

    public AprobacionService(DivisionRepository divisionRepository) {
        this.divisionRepository = divisionRepository;
    }

    public List<EstadoResponse> obtenerEstados() {
        return Arrays.stream(EstadoAprobacion.values())
                .map(e -> new EstadoResponse(e.name(), e.getNombre()))
                .toList();
    }

    @Transactional
    public DivisionResponse cambiarEstadoDivision(Long id, EstadoAprobacion estado) {
        Division division = divisionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La división no existe"));
        division.setEstado(estado);
        return DivisionResponse.from(divisionRepository.save(division), false);
    }
}
