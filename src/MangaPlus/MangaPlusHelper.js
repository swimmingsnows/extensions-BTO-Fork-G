"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestRequest = exports.PopularRequest = exports.HEX_GROUP = exports.ID_REGEX = exports.COMPLETE_REGEX = exports.TITLE_THUMBNAIL_PATH = exports.API_DOMAIN = exports.MANGAPLUS_DOMAIN = exports.LangCode = exports.TitleList = void 0;
class TitleList {
    static get() {
        return TitleList.titleList;
    }
    static set(list) {
        TitleList.titleList = list;
    }
}
exports.TitleList = TitleList;
TitleList.titleList = [];
exports.LangCode = [
    'en', 'es', 'fr', 'id', 'pt', 'ru', 'th'
];
exports.MANGAPLUS_DOMAIN = 'https://mangaplus.shueisha.co.jp';
exports.API_DOMAIN = 'https://jumpg-webapi.tokyo-cdn.com/api';
exports.TITLE_THUMBNAIL_PATH = 'title_thumbnail_portrait_list';
exports.COMPLETE_REGEX = /completado|complete/;
exports.ID_REGEX = /\\d+/;
exports.HEX_GROUP = /.{1,2}/g;
exports.PopularRequest = {
    url: `${exports.API_DOMAIN}/title_list/ranking`,
    method: 'GET',
    headers: {
        referer: `${exports.MANGAPLUS_DOMAIN}/manga_list/hot`
    }
};
exports.LatestRequest = {
    url: `${exports.API_DOMAIN}/web/web_homeV3?lang=eng`,
    method: 'GET',
    headers: {
        referer: `${exports.MANGAPLUS_DOMAIN}/updates`
    }
};
