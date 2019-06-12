"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialog_holder_component_1 = require("./dialog-holder.component");
require("rxjs/add/operator/share");
var DialogServiceConfig = (function () {
    function DialogServiceConfig() {
        this.container = null;
    }
    return DialogServiceConfig;
}());
exports.DialogServiceConfig = DialogServiceConfig;
var DialogService = (function () {
    function DialogService(resolver, applicationRef, injector, config) {
        this.resolver = resolver;
        this.applicationRef = applicationRef;
        this.injector = injector;
        this._modalsCount = 0;
        this.container = config && config.container;
    }
    Object.defineProperty(DialogService.prototype, "modalsCount", {
        get: function () {
            return this._modalsCount;
        },
        enumerable: true,
        configurable: true
    });
    DialogService.prototype.addDialog = function (component, data, options) {
        var _this = this;
        if (!this.dialogHolderComponent) {
            this.dialogHolderComponent = this.createDialogHolder();
        }
        if (!(options && options.suppressCount !== undefined && options.suppressCount))
            this._modalsCount++;
        var dlgObservable = this.dialogHolderComponent.addDialog(component, data, options).share();
        dlgObservable.subscribe(function (result) {
            if (!(options && options.suppressCount !== undefined && options.suppressCount))
                _this._modalsCount--;
        });
        return dlgObservable;
    };
    DialogService.prototype.addDialogAsync = function (component, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dialogHolderComponent) {
                            this.dialogHolderComponent = this.createDialogHolder();
                        }
                        if (!(options && options.suppressCount !== undefined && options.suppressCount))
                            this._modalsCount++;
                        return [4, this.dialogHolderComponent.addDialogAsync(component, data, options)];
                    case 1:
                        result = _a.sent();
                        if (!(options && options.suppressCount !== undefined && options.suppressCount))
                            this._modalsCount--;
                        return [2, result];
                }
            });
        });
    };
    DialogService.prototype.removeDialog = function (component) {
        if (!this.dialogHolderComponent) {
            return;
        }
        this.dialogHolderComponent.removeDialog(component);
    };
    DialogService.prototype.removeAll = function () {
        if (!this.dialogHolderComponent)
            return;
        this.dialogHolderComponent.clear();
    };
    DialogService.prototype.createDialogHolder = function () {
        var _this = this;
        var componentFactory = this.resolver.resolveComponentFactory(dialog_holder_component_1.DialogHolderComponent);
        var componentRef = componentFactory.create(this.injector);
        var componentRootNode = componentRef.hostView.rootNodes[0];
        if (!this.container) {
            var componentRootViewContainer = this.applicationRef.components[0];
            this.container = componentRootViewContainer.hostView.rootNodes[0];
        }
        this.applicationRef.attachView(componentRef.hostView);
        componentRef.onDestroy(function () {
            _this.applicationRef.detachView(componentRef.hostView);
        });
        this.container.appendChild(componentRootNode);
        return componentRef.instance;
    };
    DialogService.decorators = [
        { type: core_1.Injectable },
    ];
    DialogService.ctorParameters = function () { return [
        { type: core_1.ComponentFactoryResolver, },
        { type: core_1.ApplicationRef, },
        { type: core_1.Injector, },
        { type: DialogServiceConfig, decorators: [{ type: core_1.Optional },] },
    ]; };
    return DialogService;
}());
exports.DialogService = DialogService;
//# sourceMappingURL=dialog.service.js.map