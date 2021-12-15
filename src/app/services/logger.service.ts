import { Injectable } from '@angular/core';

const CLASS = "StorageService";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() { }

  public log(message: string) {
    console.log(message);
  }

  public logError(message: string) {
    console.error(message);
  }

}
