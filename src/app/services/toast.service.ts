import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { LoggerService } from './logger.service';

const CLASS = "ToastService";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    constructor(
        private readonly toastCtrl: ToastController,
        private readonly logger: LoggerService
    ) { }

    public createError(message: string) {
        this.logger.logError(message);
        this.create(message, "danger");
    }

    public createInfo(message: string) {
        this.create(message, "info");
    }

    public createSuccess(message: string) {
        this.create(message, "success");
    }

    public async create(message: string, color: Color) {
        this.logger.log(CLASS + ".create");

        const toast = await this.toastCtrl.create({
            message: message,
            color: color,
            duration: 4000
        });

        toast.present();
    }
}
