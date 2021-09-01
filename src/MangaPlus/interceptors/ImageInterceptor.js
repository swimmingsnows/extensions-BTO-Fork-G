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
exports.ImageInterceptor = void 0;
const MangaPlusHelper_1 = require("../MangaPlusHelper");
class ImageInterceptor {
    constructor() {
        this.encryptionKeys = {};
        this.stateManager = createSourceStateManager({});
    }
    interceptRequest(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const encryptionKey = request.url.match(/[?&]encryptionKey=([^&]\w+)&?/);
            if (encryptionKey == null || encryptionKey[1] == null)
                return request;
            // Change the url and remove the encryptionKey to avoid detection.
            const newRequest = createRequestObject({
                url: request.url.replace(/[?&]encryptionkey=[^&]+/, ''),
                method: 'GET',
                headers: Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), {
                    'referer': request.url
                })
            });
            this.encryptionKeys[newRequest.url] = encryptionKey[1];
            return newRequest;
        });
    }
    interceptResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptionKey = this.encryptionKeys[response.request.url];
            delete this.encryptionKeys[response.request.url];
            if (encryptionKey) {
                response.headers['content-type'] = 'image/jpeg';
                try {
                    response.rawData = this.decodeImage(encryptionKey, createByteArray(response.rawData));
                }
                catch (error) {
                    console.log(error);
                }
            }
            return response;
        });
    }
    decodeImage(encryptionKey, image) {
        const streamSplit = encryptionKey.match(MangaPlusHelper_1.HEX_GROUP);
        if (streamSplit == null)
            throw new Error('Invalid image');
        const keyStream = streamSplit.map((x) => parseInt(x, 16));
        const blockSizeInBytes = keyStream.length;
        return createRawData(image.map((value, i) => value ^ keyStream[i % blockSizeInBytes]));
    }
}
exports.ImageInterceptor = ImageInterceptor;
