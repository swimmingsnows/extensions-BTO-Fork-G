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
exports.MangaPlus = exports.MangaPlusInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaPlusHelper_1 = require("./MangaPlusHelper");
const MangaPlusSettings_1 = require("./MangaPlusSettings");
const Parser_1 = require("./Parser");
const Utility_1 = require("./Utility");
const MangaPlusInterceptor_1 = require("./MangaPlusInterceptor");
const interceptors_1 = require("./interceptors");
exports.MangaPlusInfo = {
    version: '1.0.0',
    name: 'MangaPlus',
    description: 'Extension that pulls licensed manga from MangaPlus.',
    author: 'GameFuzzy',
    authorWebsite: 'https://github.com/gamefuzzy',
    icon: 'icon.png',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: MangaPlusHelper_1.MANGAPLUS_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: paperback_extensions_common_1.TagType.GREEN
        }
    ]
};
class MangaPlus extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new Parser_1.Parser();
        this.stateManager = createSourceStateManager({});
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 20000,
            interceptor: new MangaPlusInterceptor_1.MangaPlusInterceptor([
                new interceptors_1.ImageInterceptor(),
                new interceptors_1.ThumbnailInterceptor()
            ])
        });
    }
    getMangaShareUrl(mangaId) {
        return `${MangaPlusHelper_1.MANGAPLUS_DOMAIN}/titles/${mangaId}`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MangaPlusHelper_1.API_DOMAIN}/title_detail`,
                method: 'GET',
                param: `?title_id=${mangaId}`
            });
            const response = yield this.requestManager.schedule(request, 1);
            const data = createByteArray(response.rawData);
            return this.parser.parseMangaDetails(data, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MangaPlusHelper_1.API_DOMAIN}/title_detail`,
                method: 'GET',
                param: `?title_id=${mangaId}`
            });
            const response = yield this.requestManager.schedule(request, 1);
            const data = createByteArray(response.rawData);
            return this.parser.parseChapterList(data, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = createRequestObject({
                    url: new Utility_1.URLBuilder(MangaPlusHelper_1.API_DOMAIN)
                        .addPathComponent('manga_viewer')
                        .addQueryParameter('chapter_id', chapterId)
                        .addQueryParameter('split', (yield (0, MangaPlusSettings_1.getSplitImages)(this.stateManager)) ? 'yes' : 'no')
                        .addQueryParameter('img_quality', (yield (0, MangaPlusSettings_1.getResolution)(this.stateManager))[0]
                        .toLowerCase()
                        .replace(' ', '_'))
                        .buildUrl(),
                    headers: {
                        referer: `${MangaPlusHelper_1.MANGAPLUS_DOMAIN}/viewer/${chapterId}`
                    },
                    method: 'GET'
                });
                const response = yield this.requestManager.schedule(request, 1);
                const data = createByteArray(response.rawData);
                const pages = this.parser.parseChapterDetails(data);
                return createChapterDetails({
                    id: chapterId,
                    mangaId: mangaId,
                    pages: pages,
                    longStrip: false
                });
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    }
    getSearchResults(query, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            let id;
            if (query.parameters && query.parameters['id']) {
                id = query.parameters['id'][0].match(MangaPlusHelper_1.ID_REGEX);
            }
            if (id && id[0]) {
                const manga = yield this.getMangaDetails(id[0]);
                return createPagedResults({
                    results: [
                        createMangaTile({
                            id: `${id[0]}`,
                            image: manga.image,
                            title: createIconText({ text: manga.titles[0] })
                        })
                    ]
                });
            }
            const request = createRequestObject({
                url: `${MangaPlusHelper_1.API_DOMAIN}/title_list/allV2`,
                method: 'GET',
                headers: {
                    referer: `${MangaPlusHelper_1.MANGAPLUS_DOMAIN}/manga_list/all`
                }
            });
            const response = yield this.requestManager.schedule(request, 1);
            const data = createByteArray(response.rawData);
            const results = this.parser.parseSearchResults(data, yield (0, MangaPlusSettings_1.getLanguages)(this.stateManager), query);
            return createPagedResults({
                results
            });
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = yield (0, MangaPlusSettings_1.getLanguages)(this.stateManager);
            const sections = [
                {
                    requests: [createRequestObject(MangaPlusHelper_1.PopularRequest)],
                    section: createHomeSection({
                        id: 'popular',
                        title: 'Popular',
                        view_more: true
                    })
                },
                {
                    requests: [
                        createRequestObject(MangaPlusHelper_1.LatestRequest),
                        createRequestObject(MangaPlusHelper_1.PopularRequest)
                    ],
                    section: createHomeSection({
                        id: 'latest',
                        title: 'Latest Updates',
                        view_more: true
                    })
                }
            ];
            const promises = [];
            for (const section of sections) {
                // Let the app load empty sections
                sectionCallback(section.section);
                // Get the section data
                promises.push(Promise.all(section.requests.map((request) => this.requestManager.schedule(request, 1))).then((responses) => __awaiter(this, void 0, void 0, function* () {
                    const data = responses.map((response) => createByteArray(response.rawData));
                    switch (section.section.id) {
                        case 'popular':
                            section.section.items = this.parser
                                .parsePopularSection(data, languages)
                                .slice(0, 20);
                            break;
                        case 'latest': {
                            section.section.items = this.parser
                                .parseRecentUpdatesSection(data, languages)
                                .slice(0, 20);
                        }
                    }
                    sectionCallback(section.section);
                })));
            }
            // Make sure the function completes
            yield Promise.all(promises);
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.offset) !== null && _a !== void 0 ? _a : 0;
            let results;
            let requests;
            switch (homepageSectionId) {
                case 'popular': {
                    requests = [createRequestObject(MangaPlusHelper_1.PopularRequest)];
                    const responses = yield Promise.all(requests.map((request) => this.requestManager.schedule(request, 1)));
                    const data = responses.map((response) => createByteArray(response.rawData));
                    results = this.parser
                        .parsePopularSection(data, yield (0, MangaPlusSettings_1.getLanguages)(this.stateManager))
                        .slice(offset, offset + 100);
                    break;
                }
                case 'latest': {
                    requests = [
                        createRequestObject(MangaPlusHelper_1.LatestRequest),
                        createRequestObject(MangaPlusHelper_1.PopularRequest)
                    ];
                    const responses = yield Promise.all(requests.map((request) => this.requestManager.schedule(request, 1)));
                    const data = responses.map((response) => createByteArray(response.rawData));
                    results = this.parser
                        .parseRecentUpdatesSection(data, yield (0, MangaPlusSettings_1.getLanguages)(this.stateManager))
                        .slice(offset, offset + 100);
                    break;
                }
                default:
                    return Promise.resolve(createPagedResults({ results: [] }));
            }
            return createPagedResults({
                results,
                metadata: { offset: offset + 100 }
            });
        });
    }
    getSourceMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(createSection({
                id: 'main',
                header: 'Source Settings',
                rows: () => Promise.resolve([
                    (0, MangaPlusSettings_1.contentSettings)(this.stateManager),
                    (0, MangaPlusSettings_1.resetSettings)(this.stateManager)
                ])
            }));
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${MangaPlusHelper_1.MANGAPLUS_DOMAIN}`,
            method: 'GET'
        });
    }
}
exports.MangaPlus = MangaPlus;
