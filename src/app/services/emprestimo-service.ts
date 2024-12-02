import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Emprestimos } from "../models/emprestimos";
import { DataService } from "./data-service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class EmprestimoService {
    http = inject(HttpClient);
    API = environment.API+"/api/emprestimos";

    dataService = inject(DataService);

    findAll(): Observable<Emprestimos[]>{
        return this.http.get<Emprestimos[]>(this.API+"/findAll");
    }

    save(emprestimo: Emprestimos): Observable<string>{
        return this.http.post<string>(this.API+"/save", emprestimo, {responseType: 'text' as 'json'});
    }

    findEmprestimoByEquipamento(patrimonio: string): Observable<Emprestimos>{
        return this.http.get<Emprestimos>(`${this.API}/findByEquipamentoPatrimonio?patrimonio=${patrimonio}`);
    }

    findByEquipamentoPorEmprestimoAtivo(patrimonio: string): Observable<Emprestimos>{
        return this.http.get<Emprestimos>(`${this.API}/findByEquipamentoPorEmprestimoAtivo?patrimonio=${patrimonio}`);
    }

    encerrar(id: number, emprestimo: Emprestimos): Observable<string>{
        return this.http.put<string>(this.API+"/encerrar/"+id, emprestimo, {responseType: 'text' as 'json'});
    }

    findByFilter(dataRetirada: Date | undefined, dataDevolucao: Date | undefined, situacao: string, ra: string, usuario: string, patrimonio: string): Observable<Emprestimos[]>{
  
        const dataRetiradaFormatada = this.dataService.formatarDataParaSalvar(dataRetirada);
        const dataDevolucaoFormatada = this.dataService.formatarDataParaSalvar(dataDevolucao);


        let httpParams = new HttpParams()
        .set('dataRetirada', dataRetiradaFormatada)
        .set('dataDevolucao', dataDevolucaoFormatada)
        .set('situacao', situacao)
        .set('ra', ra)
        .set('usuario', usuario)
        .set('patrimonio', patrimonio);
        
        return this.http.get<Emprestimos[]>(`${this.API}/findByFilter`, { params: httpParams });
    }
}
