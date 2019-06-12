import { ComponentFactoryResolver, ApplicationRef, Injector, Type } from "@angular/core";
import { DialogComponent } from "./dialog.component";
import { Observable } from "rxjs";
import 'rxjs/add/operator/share';
export interface DialogOptions {
    index?: number;
    autoCloseTimeout?: number;
    closeByClickingOutside?: boolean;
    backdropColor?: string;
    suppressCount?: boolean;
}
export declare class DialogServiceConfig {
    container: HTMLElement;
}
export declare class DialogService {
    private resolver;
    private applicationRef;
    private injector;
    private dialogHolderComponent;
    private container;
    constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector, config: DialogServiceConfig);
    private _modalsCount;
    readonly modalsCount: number;
    addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1>;
    addDialogAsync<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Promise<T1>;
    removeDialog(component: DialogComponent<any, any>): void;
    removeAll(): void;
    private createDialogHolder();
}
