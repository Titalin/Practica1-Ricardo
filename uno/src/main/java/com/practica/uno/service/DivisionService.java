package com.practica.uno.service;

import com.practica.uno.entity.Division;
import com.practica.uno.entity.EstadoAprobacion;
import com.practica.uno.repository.DivisionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.practica.uno.entity.EstadoAprobacion;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DivisionService {

    private final DivisionRepository divisionRepository;

    public DivisionService(DivisionRepository divisionRepository) {
        this.divisionRepository = divisionRepository;
    }

    public List<Division> obtenerTodas() {
        return divisionRepository.findAll();
    }

    
   public Division guardarDivision(Division division) {
     division.setId(null);
     division.setEstado(EstadoAprobacion.PENDIENTE);
      return divisionRepository.save(division);
   }

   
public Division actualizarDivision(Long id, Division datos) {

    Division division = divisionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "La division no existe"
            ));

    division.setNombre(datos.getNombre());
    division.setDescripcion(datos.getDescripcion());

    // Al editar, vuelve a quedar pendiente de aprobación
    division.setEstado(EstadoAprobacion.PENDIENTE);

    return divisionRepository.save(division);
}


public void eliminarDivision(Long id) {

    Division division = divisionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "La division no existe"
            ));

    divisionRepository.delete(division);
}


}
