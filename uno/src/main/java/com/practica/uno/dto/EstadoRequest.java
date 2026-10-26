package com.practica.uno.dto;

import com.practica.uno.entity.EstadoAprobacion;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(
        @NotNull(message = "El estado es obligatorio")
        EstadoAprobacion estado
) {
}
