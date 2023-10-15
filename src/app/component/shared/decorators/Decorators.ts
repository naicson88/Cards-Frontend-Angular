import { SpinnerService } from "src/app/service/spinner.service";
import { NgxSpinnerService } from "ngx-spinner";

export function applyLoader() {
    return function(target: any, propertyKey: String, descriptor: PropertyDescriptor){
        
        const spinner = new SpinnerService(new NgxSpinnerService())
        const metodoOriginal = descriptor.value;

        descriptor.value = function(...args: any[]){
            spinner.show();
            const retorno = metodoOriginal.apply(this, args)
            spinner.hide();
            retorno;
        }
        
        return descriptor;
    }
}