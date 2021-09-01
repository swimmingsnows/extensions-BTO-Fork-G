"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaPlusInterceptor = void 0;
const Utility_1 = require("./Utility");
class MangaPlusInterceptor {
    constructor(interceptors) {
        this.interceptors = interceptors;
    }
    interceptRequest(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            request.headers = Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
                'session-token': (0, Utility_1.uuid)()
            });
            for (const interceptor of this.interceptors) {
                request = yield interceptor.interceptRequest(request);
            }
            return request;
        });
    }
    interceptResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const interceptor of this.interceptors) {
                response = yield interceptor.interceptResponse(response);
            }
            return response;
        });
    }
}
exports.MangaPlusInterceptor = MangaPlusInterceptor;
