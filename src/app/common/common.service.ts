import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Metrix } from './../metrix';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
	public apiUrl: string = "/weather-information/";
	
	constructor( private http: HttpClient ) { }

  	public getWeather(json: string): Observable<Metrix[]> {
  		return this.http.get<Metrix[]>(this.apiUrl + json);
	}
}
