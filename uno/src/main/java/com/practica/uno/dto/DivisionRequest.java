package com.practica.uno.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DivisionRequest(
        @NotBlank(message = "El nombre de la división es obligatorio")
        @Size(max = 100, message = "El nombre no puede pasar de 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripción no puede pasar de 500 caracteres")
        String descripcion
) {
}
