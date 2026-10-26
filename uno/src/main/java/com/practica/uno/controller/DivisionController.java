package com.practica.uno.controller;

import com.practica.uno.dto.DivisionRequest;
import com.practica.uno.dto.DivisionResponse;
import com.practica.uno.service.DivisionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/divisiones")
public class DivisionController {

    private final DivisionService divisionService;

    public DivisionController(DivisionService divisionService) {
        this.divisionService = divisionService;
    }

    /** Todas las divisiones (panel del coordinador). */
    @GetMapping
    public List<DivisionResponse> obtenerDivisiones() {
        return divisionService.obtenerTodas();
    }

    /** Vista pública: divisiones aprobadas con sus carreras visibles. */
    @GetMapping("/inicio")
    public List<DivisionResponse> obtenerParaInicio() {
        return divisionService.obtenerParaInicio();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DivisionResponse agregarDivision(@Valid @RequestBody DivisionRequest division) {
        return divisionService.guardarDivision(division);
    }

    @PutMapping("/{id}")
    public DivisionResponse actualizarDivision(@PathVariable Long id,
                                               @Valid @RequestBody DivisionRequest division) {
        return divisionService.actualizarDivision(id, division);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarDivision(@PathVariable Long id) {
        divisionService.eliminarDivision(id);
    }
}
