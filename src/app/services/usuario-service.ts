import { inject, Injectable } from "@angular/core";
import { Usuarios } from "../models/usuarios";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
  })
export class UsuarioService {

    http = inject(HttpClient);
    API = "http://localhost:8080/api/usuarios";

    findByLogin(login: string, senha: string): Observable<Usuarios> {
        return this.http.get<Usuarios>(`${this.API}/findByLogin?login=${login}`);
    }

    findById(id: number): Observable<Usuarios>{
        return this.http.get<Usuarios>(this.API+"/findById/"+id);
    }
    
}
