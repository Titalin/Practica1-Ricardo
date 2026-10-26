export type EstadoAprobacion = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Carrera {
  id: number;
  nombre: string;
  descripcion: string | null;
  visible: boolean;
  divisionId: number;
  divisionNombre: string;
}

export interface CarreraRequest {
  nombre: string;
  descripcion?: string | null;
  divisionId: number;
  visible?: boolean;
}

export interface Division {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: EstadoAprobacion;
  carreras: Carrera[];
}

export interface DivisionRequest {
  nombre: string;
  descripcion?: string | null;
}

export const ETIQUETA_ESTADO: Record<EstadoAprobacion, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado'
};
