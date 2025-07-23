export class Auditoria {
    entidade!: string;
    id!: number;
    criadoPor!: string | null;
    criadoEm!: string | null; // ou Date, conforme seu uso
    modificadoPor!: string | null;
    modificadoEm!: string | null;
}
