
package com.practica.uno.controller;

import com.practica.uno.entity.Division;
import com.practica.uno.service.DivisionService;

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
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/divisiones")
public class DivisionController {

    private final DivisionService divisionService;

    public DivisionController(DivisionService divisionService) {
        this.divisionService = divisionService;
    }

    @GetMapping
    public List<Division> obtenerDivisiones() {
        return divisionService.obtenerTodas();
    }

    
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Division agregarDivision(
        @Valid @RequestBody Division division) {
    return divisionService.guardarDivision(division);
}


@PutMapping("/{id}")
public Division actualizarDivision(
        @PathVariable Long id,
        @Valid @RequestBody Division division) {

    return divisionService.actualizarDivision(id, division);
}


@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void eliminarDivision(@PathVariable Long id) {

    divisionService.eliminarDivision(id);
}


}

