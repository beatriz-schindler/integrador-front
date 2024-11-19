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

    findById(id: number): Observable<Usuarios>{
        return this.http.get<Usuarios>(this.API+"/findById/"+id);
    }
    
    findAll(): Observable<Usuarios[]>{
        return this.http.get<Usuarios[]>(this.API+"/findAll");
    }

    save(usuario: Usuarios): Observable<string>{
        return this.http.post<string>(this.API+"/save", usuario, {responseType: 'text' as 'json'});
    }

    update(usuario: Usuarios): Observable<string>{
        return this.http.put<string>(this.API+"/update/"+usuario.id, usuario, {responseType: 'text' as 'json'});
    }

    desativar(id: number): Observable<string>{
        return this.http.put<string>(`${this.API}/delete?id=${id}`, {}, {responseType: 'text' as 'json'})
    }

}
