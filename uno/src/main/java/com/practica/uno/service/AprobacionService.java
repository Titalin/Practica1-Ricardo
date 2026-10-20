package com.practica.uno.service;

import com.practica.uno.entity.EstadoAprobacion;
import org.springframework.stereotype.Service;
import com.practica.uno.repository.EstadoAprobacionRepository;

import java.util.List;
@Service
public class AprobacionService {
    private final EstadoAprobacionRepository estadoAprobacionRepository;

    public AprobacionService(EstadoAprobacionRepository estadoAprobacionRepository) {
        this.estadoAprobacionRepository = estadoAprobacionRepository;
    }

    public List<EstadoAprobacion> obtenerTodos() {
        return estadoAprobacionRepository.findAll();
    }
}
