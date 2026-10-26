// Dirección del backend Spring Boot. Cámbiala si despliegas en otro lado.
export const API_URL = 'http://localhost:8080/api';

/** Saca el mensaje de error que manda el backend ({ "mensaje": "..." }). */
export function mensajeDeError(err: unknown, porDefecto = 'Ocurrió un error inesperado'): string {
  const e = err as { status?: number; error?: { mensaje?: string } };
  if (e?.status === 0) {
    return 'No se pudo conectar con el servidor. ¿Está encendido el backend?';
  }
  return e?.error?.mensaje ?? porDefecto;
}
