import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Alunos } from "../models/alunos";

@Injectable({
    providedIn: "root"
})
export class AlunoService {

    http = inject(HttpClient);
    API = "http://localhost:8080/api/alunos";

    findAll(): Observable<Alunos[]>{
        return this.http.get<Alunos[]>(this.API+"/findAll");
    }
}
