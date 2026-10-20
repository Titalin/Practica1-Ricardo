package com.practica.uno.service;

import com.practica.uno.entity.Carrera;
import com.practica.uno.repository.CarreraRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CarreraService {
    private final CarreraRepository carreraRepository;

    public CarreraService(CarreraRepository carreraRepository) {
        this.carreraRepository = carreraRepository;
    }

    public List<Carrera> obtenerTodas() {
        return carreraRepository.findAll();
    }

    public Carrera guardarCarrera(Carrera carrera) {
        carrera.setId(null);
        return carreraRepository.save(carrera);
    }

    public Carrera actualizarCarrera(Long id, Carrera datos) {
        Carrera carrera = carreraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("La carrera no existe"));

        carrera.setNombre(datos.getNombre());
        carrera.setDescripcion(datos.getDescripcion());

        return carreraRepository.save(carrera);
    }

    public void eliminarCarrera(Long id) {
        carreraRepository.deleteById(id);
    }
}
