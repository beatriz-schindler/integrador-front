import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Equipamentos } from "../models/equipamentos";

@Injectable({
    providedIn: "root"
})
export class EquipamentoService {
    http = inject(HttpClient);
    API = "http://26.188.107.159:8080/api/equipamentos";

    findAll(): Observable<Equipamentos[]>{
        return this.http.get<Equipamentos[]>(this.API+"/findAll");

    }

    save(equipamento: Equipamentos): Observable<string>{
        return this.http.post<string>(this.API+"/save", equipamento, {responseType: 'text' as 'json'});
    }

    findById(id: number): Observable<Equipamentos>{
        return this.http.get<Equipamentos>(this.API+"/findById/"+id);
    }

    findByMarca(marca: string): Observable<Equipamentos[]>{
        return this.http.get<Equipamentos[]>(`${this.API}/findByMarca?marca=${marca}`);
    }

    findByModelo(modelo: string): Observable<Equipamentos[]>{
        return this.http.get<Equipamentos[]>(`${this.API}/findByModelo?modelo=${modelo}`);
    }

    findByPatrimonio(patrimonio: string): Observable<Equipamentos>{
        
        return this.http.get<Equipamentos>(`${this.API}/findByPatrimonio?patrimonio=${patrimonio}`);
    }

    findBySituacao(situacao: string): Observable<Equipamentos[]>{
        return this.http.get<Equipamentos[]>(`${this.API}/findBySituacao?situacao=${situacao}`);
    }

    findByFilter(situacao: string, patrimonio: string, modelo: string, marca: string): Observable<Equipamentos[]>{
        
        let httpParams = new HttpParams()
        .set('situacao', situacao)
        .set('patrimonio', patrimonio)
        .set('modelo', modelo)
        .set('marca', marca);
        
        return this.http.get<Equipamentos[]>(`${this.API}/findByFilter`, { params: httpParams });
    }

    // findByEquipamentoAtivo(): Observable<Equipamentos[]>{
    //     return this.http.get<Equipamentos[]>(this.API+"/findByEquipamentoAtivo");
    // }

    // findByEquipamentoInativo(): Observable<Equipamentos[]>{
    //     return this.http.get<Equipamentos[]>(this.API+"/findByEquipamentoInativo");
    // }

    update(equipamento: Equipamentos): Observable<string>{
        return this.http.put<string>(this.API+"/update/"+equipamento.id, equipamento, {responseType: 'text' as 'json'});
    }

    desativar(patrimonio: string): Observable<string>{
        return this.http.put<string>(`${this.API}/desativarEquipamento?patrimonio=${patrimonio}`, {}, {responseType: 'text' as 'json'});
    }

    reativar(patrimonio: string): Observable<string>{
        return this.http.put<string>(`${this.API}/reativarEquipamento?patrimonio=${patrimonio}`, {}, {responseType: 'text' as 'json'});
    }

}
