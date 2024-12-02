import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Alunos } from "../models/alunos";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class AlunoService {

    http = inject(HttpClient);
    API = environment.API+"/api/alunos";

    findAll(): Observable<Alunos[]>{
        return this.http.get<Alunos[]>(this.API+"/findAll");
    }

    findByRa(ra: string): Observable<Alunos>{
        return this.http.get<Alunos>(`${this.API}/findByRa?ra=${ra}`);
    }
}
