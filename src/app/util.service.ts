import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient) { }

  push(url = '', body = {}) {
    return this.http.post(url, body);
  }

  pull(url = 'https://api.randomuser.me') {
    return this.http.get(url);
  }

}