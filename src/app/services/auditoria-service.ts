import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Auditoria } from '../models/auditoria';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {


  http = inject(HttpClient);
  API = environment.API+"/api/auditoria";


  constructor() { }

  listarTudo(filtros?: any): Observable<any[]> {
  let params = new HttpParams();

  if (filtros) {
    if (filtros.entidade) {
      params = params.set('entidade', filtros.entidade);
    }
    if (filtros.criadoPor) {
      params = params.set('criadoPor', filtros.criadoPor);
    }
    if (filtros.modificadoPor) {
      params = params.set('modificadoPor', filtros.modificadoPor);
    }
    if (filtros.dataInicio) {
      params = params.set('dataInicio', filtros.dataInicio); // formato yyyy-MM-dd
    }
    if (filtros.dataFim) {
      params = params.set('dataFim', filtros.dataFim);
    }
  }

  return this.http.get<any[][]>(`${this.API}/audit`, { params }).pipe(
    map((dados) => dados.map(item => ({
      entidade: item[0],
      id: item[1],
      criadoPor: item[2],
      criadoEm: item[3],
      modificadoPor: item[4],
      modificadoEm: item[5],
    })))
  );
}

}
