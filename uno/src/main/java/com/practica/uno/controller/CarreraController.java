package com.practica.uno.controller;

import com.practica.uno.entity.Carrera;
import com.practica.uno.service.CarreraService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController 
@RequestMapping ("/api/carreras")
public class CarreraController {
    
    private final CarreraService carreraService;

    public CarreraController(CarreraService carreraService) {
        this.carreraService = carreraService;
    }

    @GetMapping
    public List<Carrera> obtenerCarreras() {
        return carreraService.obtenerTodas();
    }


@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Carrera agregarCarrera(
            @Valid @RequestBody Carrera carrera) {
        return carreraService.guardarCarrera(carrera);
    }

    @PutMapping("/{id}")
    public Carrera actualizarCarrera(
            @PathVariable Long id,
            @Valid @RequestBody Carrera carrera) {

        return carreraService.actualizarCarrera(id, carrera);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCarrera(@PathVariable Long id) {

        carreraService.eliminarCarrera(id);
    }
}
