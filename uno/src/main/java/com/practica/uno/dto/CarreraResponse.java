package com.practica.uno.dto;

import com.practica.uno.entity.Carrera;

public record CarreraResponse(
        Long id,
        String nombre,
        String descripcion,
        boolean visible,
        Long divisionId,
        String divisionNombre
) {
    public static CarreraResponse from(Carrera c) {
        return new CarreraResponse(
                c.getId(),
                c.getNombre(),
                c.getDescripcion(),
                c.isVisible(),
                c.getDivision().getId(),
                c.getDivision().getNombre()
        );
    }
}
