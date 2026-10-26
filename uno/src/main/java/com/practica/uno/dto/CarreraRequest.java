package com.practica.uno.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CarreraRequest(
        @NotBlank(message = "El nombre de la carrera es obligatorio")
        @Size(max = 100, message = "El nombre no puede pasar de 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripción no puede pasar de 500 caracteres")
        String descripcion,

        @NotNull(message = "Debes elegir una división")
        Long divisionId,

        // Opcional: si viene null, al crear queda visible y al editar no cambia.
        Boolean visible
) {
}
