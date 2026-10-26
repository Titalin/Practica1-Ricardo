package com.practica.uno.dto;

import com.practica.uno.entity.Carrera;
import com.practica.uno.entity.Division;
import com.practica.uno.entity.EstadoAprobacion;

import java.util.Comparator;
import java.util.List;

public record DivisionResponse(
        Long id,
        String nombre,
        String descripcion,
        EstadoAprobacion estado,
        List<CarreraResponse> carreras
) {
    /**
     * @param soloVisibles si es true, solo incluye las carreras que se muestran en el inicio.
     */
    public static DivisionResponse from(Division d, boolean soloVisibles) {
        List<CarreraResponse> carreras = d.getCarreras().stream()
                .filter(c -> !soloVisibles || c.isVisible())
                .sorted(Comparator.comparing(Carrera::getNombre, String.CASE_INSENSITIVE_ORDER))
                .map(CarreraResponse::from)
                .toList();

        return new DivisionResponse(d.getId(), d.getNombre(), d.getDescripcion(), d.getEstado(), carreras);
    }
}
