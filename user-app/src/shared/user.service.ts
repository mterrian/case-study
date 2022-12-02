import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { NewUser, User } from "./User";
import { Observable } from "rxjs";

@Injectable({
  providedIn:"root"
})

export class UserService {
  baseUrl:string = "http://localhost:8080/api"
  headers = { "Content-Type": "application/json" }

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/user`, { headers: this.headers })
  }
  getUser(user: User): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/user/${user.id}`, { headers: this.headers })
  }
  createUser(user: NewUser) {
    return this.httpClient.post(`${this.baseUrl}/createuser`, user, { headers: this.headers })
  }
  updateUser(user: User) {
    return this.httpClient.put(`${this.baseUrl}/user/${user.id}`, user, { headers: this.headers })
  }
  deleteUser(user: User) {
    return this.httpClient.delete(`${this.baseUrl}/user/${user.id}`, { headers: this.headers })
  }
}