package com.practica.uno.controller;

import com.practica.uno.dto.CarreraRequest;
import com.practica.uno.dto.CarreraResponse;
import com.practica.uno.dto.VisibilidadRequest;
import com.practica.uno.service.CarreraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
public class CarreraController {

    private final CarreraService carreraService;

    public CarreraController(CarreraService carreraService) {
        this.carreraService = carreraService;
    }

    @GetMapping
    public List<CarreraResponse> obtenerCarreras() {
        return carreraService.obtenerTodas();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CarreraResponse agregarCarrera(@Valid @RequestBody CarreraRequest carrera) {
        return carreraService.guardarCarrera(carrera);
    }

    @PutMapping("/{id}")
    public CarreraResponse actualizarCarrera(@PathVariable Long id,
                                             @Valid @RequestBody CarreraRequest carrera) {
        return carreraService.actualizarCarrera(id, carrera);
    }

    /** Ocultar / mostrar la carrera en el inicio. */
    @PatchMapping("/{id}/visibilidad")
    public CarreraResponse cambiarVisibilidad(@PathVariable Long id,
                                              @Valid @RequestBody VisibilidadRequest body) {
        return carreraService.cambiarVisibilidad(id, body.visible());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCarrera(@PathVariable Long id) {
        carreraService.eliminarCarrera(id);
    }
}
