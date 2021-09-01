"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const APIInterface_1 = require("./APIInterface");
const MangaPlusHelper_1 = require("./MangaPlusHelper");
class Parser {
    parseMangaDetails(data, mangaId) {
        const result = APIInterface_1.MangaPlusResponse.decode(data);
        if (result.success == null) {
            const error = result.error.englishPopup.body;
            console.log(error);
            throw new Error(error);
        }
        const details = result.success.titleDetailView;
        const title = details.title;
        const isCompleted = MangaPlusHelper_1.COMPLETE_REGEX.test(details.nonAppearanceInfo);
        return createManga({
            id: mangaId,
            views: title.viewCount,
            rating: 0,
            titles: [title.name],
            author: title.author.replace(' / ', ', '),
            image: title.portraitImageUrl,
            status: isCompleted ? paperback_extensions_common_1.MangaStatus.COMPLETED : paperback_extensions_common_1.MangaStatus.ONGOING,
            desc: details.overview + '\n\n' + details.viewingPeriodDescription
        });
    }
    parseChapterList(data, mangaId) {
        try {
            const result = APIInterface_1.MangaPlusResponse.decode(data);
            if (result.success == null) {
                const error = result.error.englishPopup.body;
                console.log(error);
                throw new Error(error);
            }
            const details = result.success.titleDetailView;
            const chapters = details.firstChapterList.concat(details.lastChapterList);
            return (chapters
                .reverse()
                // If the subTitle is null, then the chapter time expired.
                .filter((chapter) => chapter.subTitle != null)
                .map((chapter) => createChapter({
                mangaId,
                id: `${chapter.chapterId}`,
                chapNum: parseInt(chapter.name.substring(chapter.name.indexOf('#') + 1)) || -1,
                langCode: MangaPlusHelper_1.LangCode[details.title.language],
                name: `${chapter.name} - ${chapter.subTitle}`,
                time: new Date(1000 * chapter.startTimeStamp)
            })));
        }
        catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }
    parseChapterDetails(data) {
        try {
            const result = APIInterface_1.MangaPlusResponse.decode(data);
            if (result.success == null) {
                const error = result.error.englishPopup.body;
                console.log(error);
                throw new Error(error);
            }
            return result.success.mangaViewer.pages
                .filter((page) => page.page != null)
                .map((page) => {
                const encryptionKey = page.page.encryptionKey == null
                    ? ''
                    : `&encryptionKey=${page.page.encryptionKey}`;
                return page.page.imageUrl + encryptionKey;
            });
        }
        catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }
    parseSearchResults(data, languages, query) {
        const result = APIInterface_1.MangaPlusResponse.decode(data);
        if (result.success == null) {
            throw new Error('Invalid response from server');
        }
        if (result.success.titleDetailView != null) {
            const title = result.success.titleDetailView.title;
            if (languages.includes(MangaPlusHelper_1.LangCode[title.language])) {
                return [
                    createMangaTile({
                        id: `${title.titleId}`,
                        image: title.portraitImageUrl,
                        title: createIconText({ text: title.name })
                    })
                ];
            }
            return [];
        }
        MangaPlusHelper_1.TitleList.set(result.success.allTitlesViewV2.allTitlesGroup
            .flatMap((allTitlesGroup) => allTitlesGroup.titles)
            .filter((title) => languages.includes(MangaPlusHelper_1.LangCode[title.language])));
        return MangaPlusHelper_1.TitleList.get()
            .filter((title) => {
            if (query.title && query.parameters['author'] && query.parameters['author'][0]) {
                return (title.name.toLowerCase()
                    .includes(query.title.toLowerCase()) &&
                    title.author
                        .toLowerCase()
                        .includes(query.parameters['author'][0].toLowerCase()));
            }
            else if (query.title) {
                return title.name
                    .toLowerCase()
                    .includes(query.title.toLowerCase());
            }
            else if (query.parameters['author'] && query.parameters['author'][0]) {
                return title.author
                    .toLowerCase()
                    .includes(query.parameters['author'][0].toLowerCase());
            }
        })
            .map((title) => createMangaTile({
            id: `${title.titleId}`,
            image: title.portraitImageUrl,
            title: createIconText({ text: title.name })
        }));
    }
    parsePopularSection(data, languages) {
        const result = APIInterface_1.MangaPlusResponse.decode(data[0]);
        if (result.success == null) {
            throw new Error('Invalid response from server');
        }
        MangaPlusHelper_1.TitleList.set(result.success.titleRankingView.titles.filter((title) => languages.includes(MangaPlusHelper_1.LangCode[title.language])));
        const titleList = MangaPlusHelper_1.TitleList.get();
        return titleList.map((title) => createMangaTile({
            id: `${title.titleId}`,
            image: title.portraitImageUrl,
            title: createIconText({ text: title.name })
        }));
    }
    parseRecentUpdatesSection(data, languages) {
        const result = APIInterface_1.MangaPlusResponse.decode(data[0]);
        if (result.success == null) {
            throw new Error('Invalid response from server');
        }
        // Fetch all titles to get newer thumbnail urls at the interceptor.
        const popularResult = APIInterface_1.MangaPlusResponse.decode(data[1]);
        if (popularResult.success != null) {
            MangaPlusHelper_1.TitleList.set(popularResult.success.titleRankingView.titles.filter((title) => languages.includes(MangaPlusHelper_1.LangCode[title.language])));
        }
        const mangas = result.success.webHomeViewV3.groups
            .flatMap((group) => group.titleGroups)
            .flatMap((titleGroup) => titleGroup.titles)
            .map((title) => title.title)
            .filter((title) => languages.includes(MangaPlusHelper_1.LangCode[title.language]))
            .map((title) => createMangaTile({
            id: `${title.titleId}`,
            image: title.portraitImageUrl,
            title: createIconText({ text: title.name })
        }));
        // Filter out duplicates by title
        return [...new Set(mangas.map((manga) => manga.title.text))].map((title) => mangas.find((manga) => manga.title.text === title));
    }
}
exports.Parser = Parser;
