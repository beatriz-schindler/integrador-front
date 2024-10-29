import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Emprestimos } from "../models/emprestimos";

@Injectable({
    providedIn: "root"
})
export class EmprestimoService {
    http = inject(HttpClient);
    API = "http://localhost:8080/api/emprestimos";

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
}
