import { DatePipe } from "@angular/common";

export class Equipamentos {
    id!: number;
    patrimonio!: string;
    marca!: string;
    modelo!: string;
    dataAquisicao!: DatePipe;
    observacao!: string;
    situacao!: string;
    ativo!: number;
}
