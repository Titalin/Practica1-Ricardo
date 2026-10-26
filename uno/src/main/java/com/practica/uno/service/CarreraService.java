package com.practica.uno.service;

import com.practica.uno.dto.CarreraRequest;
import com.practica.uno.dto.CarreraResponse;
import com.practica.uno.entity.Carrera;
import com.practica.uno.entity.Division;
import com.practica.uno.repository.CarreraRepository;
import com.practica.uno.repository.DivisionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CarreraService {

    private final CarreraRepository carreraRepository;
    private final DivisionRepository divisionRepository;

    public CarreraService(CarreraRepository carreraRepository,
                          DivisionRepository divisionRepository) {
        this.carreraRepository = carreraRepository;
        this.divisionRepository = divisionRepository;
    }

    @Transactional(readOnly = true)
    public List<CarreraResponse> obtenerTodas() {
        return carreraRepository.findAll(Sort.by("id")).stream()
                .map(CarreraResponse::from)
                .toList();
    }

    @Transactional
    public CarreraResponse guardarCarrera(CarreraRequest datos) {
        Division division = buscarDivision(datos.divisionId());
        String nombre = datos.nombre().trim();

        if (carreraRepository.existsByNombreIgnoreCaseAndDivisionId(nombre, division.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una carrera con ese nombre en esa división");
        }

        Carrera carrera = new Carrera();
        carrera.setNombre(nombre);
        carrera.setDescripcion(datos.descripcion());
        carrera.setDivision(division);
        carrera.setVisible(datos.visible() == null || datos.visible());

        return CarreraResponse.from(carreraRepository.save(carrera));
    }

    @Transactional
    public CarreraResponse actualizarCarrera(Long id, CarreraRequest datos) {
        Carrera carrera = buscarCarrera(id);
        Division division = buscarDivision(datos.divisionId());
        String nombre = datos.nombre().trim();

        if (carreraRepository.existsByNombreIgnoreCaseAndDivisionIdAndIdNot(nombre, division.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una carrera con ese nombre en esa división");
        }

        carrera.setNombre(nombre);
        carrera.setDescripcion(datos.descripcion());
        carrera.setDivision(division);
        if (datos.visible() != null) {
            carrera.setVisible(datos.visible());
        }

        return CarreraResponse.from(carreraRepository.save(carrera));
    }

    @Transactional
    public CarreraResponse cambiarVisibilidad(Long id, boolean visible) {
        Carrera carrera = buscarCarrera(id);
        carrera.setVisible(visible);
        return CarreraResponse.from(carreraRepository.save(carrera));
    }

    @Transactional
    public void eliminarCarrera(Long id) {
        carreraRepository.delete(buscarCarrera(id));
    }

    private Carrera buscarCarrera(Long id) {
        return carreraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La carrera no existe"));
    }

    private Division buscarDivision(Long id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La división no existe"));
    }
}
