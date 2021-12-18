import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { User } from '../login/login.dtos';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';

const CLASS = "StorageService";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private readonly logger: LoggerService,
    private readonly toast: ToastService
  ) { }

  /** Retrieves data from storage by key */
  public async getData(key: string): Promise<string> {
    this.logger.log(CLASS + ".getData");
    try {
      let data = await Storage.get({ key: key });
      return data.value;
    } catch (error) {
      this.toast.createError(error);
    }
  }

  /** Saves data into storage */
  public async setData(key: string, value: string) {
    this.logger.log(CLASS + ".setData")
    try {
      await Storage.set({ key: key, value: value });
    } catch (error) {
      this.toast.createError(error);
    }
  }

  /** Removes data from storage by key */
  public async removeData(key: string): Promise<boolean> {
    this.logger.log(CLASS + ".removeData")
    try {
      await Storage.remove({ key: key });
      return this.getData(key) != undefined;
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async getCurrentUserIdent(): Promise<string> {
    this.logger.log(CLASS + ".getCurrentUser");
    try {
      let currentUserJson = await this.getData("currentUser");
      let currentUser: User = JSON.parse(currentUserJson); 
      return currentUser.ident;
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
