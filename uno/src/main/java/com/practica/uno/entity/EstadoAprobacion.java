package com.practica.uno.entity;
 
public enum EstadoAprobacion {
    
    PENDIENTE("Pendiente"),
    APROBADO("Aprobado"),
    RECHAZADO("Rechazado");

    private final String nombre;

    EstadoAprobacion(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
