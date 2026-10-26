package com.practica.uno.controller;

import com.practica.uno.dto.DivisionResponse;
import com.practica.uno.dto.EstadoRequest;
import com.practica.uno.dto.EstadoResponse;
import com.practica.uno.service.AprobacionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aprobaciones")
public class AprobacionController {

    private final AprobacionService aprobacionService;

    public AprobacionController(AprobacionService aprobacionService) {
        this.aprobacionService = aprobacionService;
    }

    @GetMapping("/estados")
    public List<EstadoResponse> obtenerEstados() {
        return aprobacionService.obtenerEstados();
    }

    /** Aprobar / rechazar / dejar pendiente una división. */
    @PatchMapping("/divisiones/{id}")
    public DivisionResponse cambiarEstadoDivision(@PathVariable Long id,
                                                  @Valid @RequestBody EstadoRequest body) {
        return aprobacionService.cambiarEstadoDivision(id, body.estado());
    }
}
