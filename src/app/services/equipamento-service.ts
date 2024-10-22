import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Equipamentos } from "../models/equipamentos";

@Injectable({
    providedIn: "root"
})
export class EquipamentoService {
    http = inject(HttpClient);
    API = "http://localhost:8080/api/equipamentos";

    findAll(): Observable<Equipamentos[]>{
        return this.http.get<Equipamentos[]>(this.API+"/findAll");

    }

    save(equipamento: Equipamentos): Observable<string>{
        return this.http.post<string>(this.API+"/save", equipamento, {responseType: 'text' as 'json'});
    }

    findById(id: number): Observable<Equipamentos>{
        return this.http.get<Equipamentos>(this.API+"/findById/"+id);
    }

    update(equipamento: Equipamentos): Observable<string>{
        return this.http.put<string>(this.API+"/update/"+equipamento.id, equipamento, {responseType: 'text' as 'json'});
    }

    desativar(id: number): Observable<string>{
        return this.http.put<string>(`${this.API}/desativarEquipamento?login=${id}`, {responseType: 'text' as 'json'});
    }

}
