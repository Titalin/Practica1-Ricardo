package com.practica.uno.dto;

import jakarta.validation.constraints.NotNull;

public record VisibilidadRequest(
        @NotNull(message = "Indica si la carrera debe mostrarse u ocultarse")
        Boolean visible
) {
}
