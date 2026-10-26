package com.practica.uno.service;

import com.practica.uno.dto.DivisionRequest;
import com.practica.uno.dto.DivisionResponse;
import com.practica.uno.entity.Division;
import com.practica.uno.entity.EstadoAprobacion;
import com.practica.uno.repository.DivisionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class DivisionService {

    private final DivisionRepository divisionRepository;

    public DivisionService(DivisionRepository divisionRepository) {
        this.divisionRepository = divisionRepository;
    }

    /** Todas las divisiones con todas sus carreras (uso del coordinador). */
    @Transactional(readOnly = true)
    public List<DivisionResponse> obtenerTodas() {
        return divisionRepository.findAll(Sort.by("nombre")).stream()
                .map(d -> DivisionResponse.from(d, false))
                .toList();
    }

    /**
     * Lo que ve el usuario general en el inicio: solo divisiones APROBADAS,
     * solo carreras visibles, y sin divisiones vacías.
     */
    @Transactional(readOnly = true)
    public List<DivisionResponse> obtenerParaInicio() {
        return divisionRepository.findByEstado(EstadoAprobacion.APROBADO).stream()
                .map(d -> DivisionResponse.from(d, true))
                .filter(d -> !d.carreras().isEmpty())
                .sorted(Comparator.comparing(DivisionResponse::nombre, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Transactional
    public DivisionResponse guardarDivision(DivisionRequest datos) {
        Division division = new Division();
        division.setNombre(datos.nombre().trim());
        division.setDescripcion(datos.descripcion());
        division.setEstado(EstadoAprobacion.PENDIENTE);
        return DivisionResponse.from(divisionRepository.save(division), false);
    }

    @Transactional
    public DivisionResponse actualizarDivision(Long id, DivisionRequest datos) {
        Division division = buscarDivision(id);
        division.setNombre(datos.nombre().trim());
        division.setDescripcion(datos.descripcion());
        division.setEstado(EstadoAprobacion.PENDIENTE);
        return DivisionResponse.from(divisionRepository.save(division), false);
    }

    @Transactional
    public void eliminarDivision(Long id) {
        Division division = buscarDivision(id);
        if (!division.getCarreras().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar una división que todavía tiene carreras");
        }
        divisionRepository.delete(division);
    }

    private Division buscarDivision(Long id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La división no existe"));
    }
}
