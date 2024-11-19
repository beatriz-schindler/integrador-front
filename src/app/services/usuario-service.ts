import { inject, Injectable } from "@angular/core";
import { Usuarios } from "../models/usuarios";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
  })
export class UsuarioService {

    http = inject(HttpClient);
    API = "http://26.188.107.159:8080/api/usuarios";

   

    findById(id: number): Observable<Usuarios>{
        return this.http.get<Usuarios>(this.API+"/findById/"+id);
    }
    
}
