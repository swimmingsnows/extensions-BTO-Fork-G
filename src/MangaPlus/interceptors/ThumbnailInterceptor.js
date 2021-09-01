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
exports.ThumbnailInterceptor = void 0;
const MangaPlusHelper_1 = require("../MangaPlusHelper");
class ThumbnailInterceptor {
    constructor() {
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 20000,
        });
        this.stateManager = createSourceStateManager({});
    }
    interceptRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return request;
        });
    }
    interceptResponse(response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const isBadCode = response.status == 401 || response.status == 404;
            const url = response.request.url;
            if (isBadCode && url.includes(MangaPlusHelper_1.TITLE_THUMBNAIL_PATH)) {
                const titleId = parseInt((_a = url.split(`/${MangaPlusHelper_1.TITLE_THUMBNAIL_PATH}`)[0].split('/').pop()) !== null && _a !== void 0 ? _a : '');
                const title = MangaPlusHelper_1.TitleList.get().find((title) => title.titleId == titleId);
                if (!title)
                    return response;
                const request = createRequestObject({
                    url: title.portraitImageUrl,
                    method: 'GET',
                    headers: response.request.headers,
                });
                return yield this.requestManager.schedule(request, 1);
            }
            return response;
        });
    }
}
exports.ThumbnailInterceptor = ThumbnailInterceptor;
