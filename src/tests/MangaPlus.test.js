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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaPlus_1 = require("../MangaPlus/MangaPlus");
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const axios_1 = __importDefault(require("axios"));
describe('MangaPlus Tests', () => {
    const wrapper = new paperback_extensions_common_1.APIWrapper();
    const source = new MangaPlus_1.MangaPlus(cheerio_1.default);
    const expect = chai_1.default.expect;
    chai_1.default.use(chai_as_promised_1.default);
    /**
   * The Manga ID which this unit test uses to base it's details off of.
   * Try to choose a manga which is updated frequently, so that the historical checking test can
   * return proper results, as it is limited to searching 30 days back due to extremely long processing times otherwise.
   */
    const mangaId = '100160'; // Choujin X
    it('Retrieve Manga Details', () => __awaiter(void 0, void 0, void 0, function* () {
        const details = yield wrapper.getMangaDetails(source, mangaId);
        expect(details, 'No results found with test-defined ID [' + mangaId + ']')
            .to.exist;
        // Validate that the fields are filled
        const data = details;
        expect(data.image, 'Missing Image').to.be.not.empty;
        expect(data.status, 'Missing Status').to.exist;
        expect(data.desc, 'Missing Description').to.be.not.empty;
        expect(data.titles, 'Missing Titles').to.be.not.empty;
        expect(data.rating, 'Missing Rating').to.exist;
    }));
    it('Get Chapters', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield wrapper.getChapters(source, mangaId);
        expect(data, 'No chapters present for: [' + mangaId + ']').to.not.be.empty;
        const entry = data[0];
        expect(entry.id, 'No ID present').to.not.be.empty;
        expect(entry.name, 'No title available').to.not.be.empty;
        expect(entry.chapNum, 'No chapter number present').to.not.be.null;
    }));
    it('Get Chapter Details', () => __awaiter(void 0, void 0, void 0, function* () {
        const chapters = yield wrapper.getChapters(source, mangaId);
        const chapter = chapters[0];
        const data = yield wrapper.getChapterDetails(source, mangaId, chapter.id);
        console.log(chapter);
        console.log(data.pages.length);
        expect(data, 'No server response').to.exist;
        expect(data, 'Empty server response').to.not.be.empty;
        expect(data.id, 'Missing ID').to.be.not.empty;
        expect(data.mangaId, 'Missing MangaID').to.be.not.empty;
        expect(data.pages, 'No pages present').to.be.not.empty;
    }));
    it('Testing search', () => __awaiter(void 0, void 0, void 0, function* () {
        const testSearch = {
            title: 'My Hero Academia',
            parameters: {}
        };
        const search = yield wrapper.searchRequest(source, testSearch, 1);
        const result = search.results[0];
        expect(result, 'No response from server').to.exist;
        expect(result.id, 'No ID found for search query').to.be.not.empty;
        expect(result.image, 'No image found for search').to.be.not.empty;
        expect(result.title, 'No title').to.be.not.null;
        expect(result.subtitleText, 'No subtitle text').to.be.not.null;
    }));
    it('Testing Home-Page aquisition', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const homePages = yield wrapper.getHomePageSections(source);
        expect(homePages, 'No response from server').to.exist;
        expect(homePages[0].items, 'No items present').to.exist;
        // Ensure that we can resolve each of the images for the home-page, since these images are generated and not scraped
        const promises = [];
        for (const obj of (_a = homePages[0].items) !== null && _a !== void 0 ? _a : []) {
            promises.push(axios_1.default.get(obj.image).then((imageResult) => {
                expect(imageResult.status).to.equal(200);
            }));
        }
        yield Promise.all(promises);
    }));
});
