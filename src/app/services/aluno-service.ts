import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Alunos } from "../models/alunos";

@Injectable({
    providedIn: "root"
})
export class AlunoService {

    http = inject(HttpClient);
    API = "http://26.188.107.159:8080/api/alunos";

    findAll(): Observable<Alunos[]>{
        return this.http.get<Alunos[]>(this.API+"/findAll");
    }

    findByRa(ra: string): Observable<Alunos>{
        return this.http.get<Alunos>(`${this.API}/findByRa?ra=${ra}`);
    }
}
