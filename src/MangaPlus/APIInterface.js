"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaPlusResponse = exports.SuccessResult = exports.WebHomeViewV3 = exports.AllTitlesViewV2 = exports.AllTitlesGroup = exports.MangaViewer = exports.TitleDetailView = exports.TitleRankingView = exports.UpdatedTitleV2Group = exports.OriginalTitleGroup = exports.UpdatedTitle = exports.Title = exports.MangaPlusPage = exports.MangaPage = exports.ErrorResult = exports.Popup = exports.Chapter = exports.UpdateTiming = exports.Language = exports.Action = void 0;
const light_1 = require("protobufjs/light");
var Action;
(function (Action) {
    Action[Action["DEFAULT"] = 0] = "DEFAULT";
    Action[Action["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
    Action[Action["MAINTAINENCE"] = 2] = "MAINTAINENCE";
    Action[Action["GEOIP_BLOCKING"] = 3] = "GEOIP_BLOCKING";
})(Action = exports.Action || (exports.Action = {}));
var Language;
(function (Language) {
    Language[Language["ENGLISH"] = 0] = "ENGLISH";
    Language[Language["SPANISH"] = 1] = "SPANISH";
    Language[Language["FRENCH"] = 2] = "FRENCH";
    Language[Language["INDONESIAN"] = 3] = "INDONESIAN";
    Language[Language["PORTUGESE_BR"] = 4] = "PORTUGESE_BR";
    Language[Language["RUSSIAN"] = 5] = "RUSSIAN";
    Language[Language["THAI"] = 6] = "THAI";
})(Language = exports.Language || (exports.Language = {}));
var UpdateTiming;
(function (UpdateTiming) {
    UpdateTiming[UpdateTiming["NOT_REGULARLY"] = 0] = "NOT_REGULARLY";
    UpdateTiming[UpdateTiming["MONDAY"] = 1] = "MONDAY";
    UpdateTiming[UpdateTiming["TUESDAY"] = 2] = "TUESDAY";
    UpdateTiming[UpdateTiming["WEDNESDAY"] = 3] = "WEDNESDAY";
    UpdateTiming[UpdateTiming["THURSDAY"] = 4] = "THURSDAY";
    UpdateTiming[UpdateTiming["FRIDAY"] = 5] = "FRIDAY";
    UpdateTiming[UpdateTiming["SATURDAY"] = 6] = "SATURDAY";
    UpdateTiming[UpdateTiming["SUNDAY"] = 7] = "SUNDAY";
    UpdateTiming[UpdateTiming["DAY"] = 8] = "DAY";
})(UpdateTiming = exports.UpdateTiming || (exports.UpdateTiming = {}));
let Chapter = class Chapter extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'int32', 'required')
], Chapter.prototype, "titleId", void 0);
__decorate([
    light_1.Field.d(2, 'int32', 'required')
], Chapter.prototype, "chapterId", void 0);
__decorate([
    light_1.Field.d(3, 'string', 'required')
], Chapter.prototype, "name", void 0);
__decorate([
    light_1.Field.d(4, 'string', 'optional', null)
], Chapter.prototype, "subTitle", void 0);
__decorate([
    light_1.Field.d(6, 'int32', 'required')
], Chapter.prototype, "startTimeStamp", void 0);
__decorate([
    light_1.Field.d(7, 'int32', 'required')
], Chapter.prototype, "endTimeStamp", void 0);
Chapter = __decorate([
    light_1.Type.d('Chapter')
], Chapter);
exports.Chapter = Chapter;
let Popup = class Popup extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'string', 'required')
], Popup.prototype, "subject", void 0);
__decorate([
    light_1.Field.d(2, 'string', 'required')
], Popup.prototype, "body", void 0);
Popup = __decorate([
    light_1.Type.d('Popup')
], Popup);
exports.Popup = Popup;
let ErrorResult = class ErrorResult extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, Action, 'required')
], ErrorResult.prototype, "action", void 0);
__decorate([
    light_1.Field.d(2, Popup, 'required')
], ErrorResult.prototype, "englishPopup", void 0);
__decorate([
    light_1.Field.d(3, Popup, 'required')
], ErrorResult.prototype, "spanishPopup", void 0);
ErrorResult = __decorate([
    light_1.Type.d('ErrorResult')
], ErrorResult);
exports.ErrorResult = ErrorResult;
let MangaPage = class MangaPage extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'string', 'required')
], MangaPage.prototype, "imageUrl", void 0);
__decorate([
    light_1.Field.d(2, 'int32', 'required')
], MangaPage.prototype, "width", void 0);
__decorate([
    light_1.Field.d(3, 'int32', 'required')
], MangaPage.prototype, "height", void 0);
__decorate([
    light_1.Field.d(5, 'string', 'optional', null)
], MangaPage.prototype, "encryptionKey", void 0);
MangaPage = __decorate([
    light_1.Type.d('MangaPage')
], MangaPage);
exports.MangaPage = MangaPage;
let MangaPlusPage = class MangaPlusPage extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, MangaPage, 'optional', null)
], MangaPlusPage.prototype, "page", void 0);
MangaPlusPage = __decorate([
    light_1.Type.d('MangaPlusPage')
], MangaPlusPage);
exports.MangaPlusPage = MangaPlusPage;
let Title = class Title extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'int32', 'required')
], Title.prototype, "titleId", void 0);
__decorate([
    light_1.Field.d(2, 'string', 'required')
], Title.prototype, "name", void 0);
__decorate([
    light_1.Field.d(3, 'string', 'required')
], Title.prototype, "author", void 0);
__decorate([
    light_1.Field.d(4, 'string', 'required')
], Title.prototype, "portraitImageUrl", void 0);
__decorate([
    light_1.Field.d(5, 'string', 'required')
], Title.prototype, "landscapeImageUrl", void 0);
__decorate([
    light_1.Field.d(6, 'int32', 'optional', 0)
], Title.prototype, "viewCount", void 0);
__decorate([
    light_1.Field.d(7, Language, 'optional', Language.ENGLISH)
], Title.prototype, "language", void 0);
Title = __decorate([
    light_1.Type.d('Title')
], Title);
exports.Title = Title;
let UpdatedTitle = class UpdatedTitle extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, Title, 'required')
], UpdatedTitle.prototype, "title", void 0);
UpdatedTitle = __decorate([
    light_1.Type.d('UpdatedTitle')
], UpdatedTitle);
exports.UpdatedTitle = UpdatedTitle;
let OriginalTitleGroup = class OriginalTitleGroup extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'string', 'required')
], OriginalTitleGroup.prototype, "theTitle", void 0);
__decorate([
    light_1.Field.d(3, UpdatedTitle, 'repeated', [])
], OriginalTitleGroup.prototype, "titles", void 0);
OriginalTitleGroup = __decorate([
    light_1.Type.d('OriginalTitleGroup')
], OriginalTitleGroup);
exports.OriginalTitleGroup = OriginalTitleGroup;
let UpdatedTitleV2Group = class UpdatedTitleV2Group extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'string', 'required')
], UpdatedTitleV2Group.prototype, "groupName", void 0);
__decorate([
    light_1.Field.d(2, OriginalTitleGroup, 'repeated', [])
], UpdatedTitleV2Group.prototype, "titleGroups", void 0);
UpdatedTitleV2Group = __decorate([
    light_1.Type.d('UpdatedTitleV2Group')
], UpdatedTitleV2Group);
exports.UpdatedTitleV2Group = UpdatedTitleV2Group;
let TitleRankingView = class TitleRankingView extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, Title, 'repeated', [])
], TitleRankingView.prototype, "titles", void 0);
TitleRankingView = __decorate([
    light_1.Type.d('TitleRankingView')
], TitleRankingView);
exports.TitleRankingView = TitleRankingView;
let TitleDetailView = class TitleDetailView extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, Title, 'required')
], TitleDetailView.prototype, "title", void 0);
__decorate([
    light_1.Field.d(2, 'string', 'required')
], TitleDetailView.prototype, "titleImageUrl", void 0);
__decorate([
    light_1.Field.d(3, 'string', 'required')
], TitleDetailView.prototype, "overview", void 0);
__decorate([
    light_1.Field.d(4, 'string', 'required')
], TitleDetailView.prototype, "backgroundImageUrl", void 0);
__decorate([
    light_1.Field.d(5, 'int32', 'optional', 0)
], TitleDetailView.prototype, "nextTimeStamp", void 0);
__decorate([
    light_1.Field.d(6, UpdateTiming, 'optional', UpdateTiming.DAY)
], TitleDetailView.prototype, "updateTiming", void 0);
__decorate([
    light_1.Field.d(7, 'string', 'optional', '')
], TitleDetailView.prototype, "viewingPeriodDescription", void 0);
__decorate([
    light_1.Field.d(8, 'string', 'optional', '')
], TitleDetailView.prototype, "nonAppearanceInfo", void 0);
__decorate([
    light_1.Field.d(9, Chapter, 'repeated', [])
], TitleDetailView.prototype, "firstChapterList", void 0);
__decorate([
    light_1.Field.d(10, Chapter, 'repeated', [])
], TitleDetailView.prototype, "lastChapterList", void 0);
__decorate([
    light_1.Field.d(14, 'bool', 'optional', true)
], TitleDetailView.prototype, "isSimulReleased", void 0);
__decorate([
    light_1.Field.d(17, 'bool', 'optional', true)
], TitleDetailView.prototype, "chaptersDescending", void 0);
TitleDetailView = __decorate([
    light_1.Type.d('TitleDetailView')
], TitleDetailView);
exports.TitleDetailView = TitleDetailView;
let MangaViewer = class MangaViewer extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, MangaPlusPage, 'repeated', [])
], MangaViewer.prototype, "pages", void 0);
MangaViewer = __decorate([
    light_1.Type.d('MangaViewer')
], MangaViewer);
exports.MangaViewer = MangaViewer;
let AllTitlesGroup = class AllTitlesGroup extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'string', 'required')
], AllTitlesGroup.prototype, "theTitle", void 0);
__decorate([
    light_1.Field.d(2, Title, 'repeated', [])
], AllTitlesGroup.prototype, "titles", void 0);
AllTitlesGroup = __decorate([
    light_1.Type.d('AllTitlesGroup')
], AllTitlesGroup);
exports.AllTitlesGroup = AllTitlesGroup;
let AllTitlesViewV2 = class AllTitlesViewV2 extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, AllTitlesGroup, 'repeated', [])
], AllTitlesViewV2.prototype, "allTitlesGroup", void 0);
AllTitlesViewV2 = __decorate([
    light_1.Type.d('AllTitlesViewV2')
], AllTitlesViewV2);
exports.AllTitlesViewV2 = AllTitlesViewV2;
let WebHomeViewV3 = class WebHomeViewV3 extends light_1.Message {
};
__decorate([
    light_1.Field.d(2, UpdatedTitleV2Group, 'repeated', [])
], WebHomeViewV3.prototype, "groups", void 0);
WebHomeViewV3 = __decorate([
    light_1.Type.d('WebHomeViewV3')
], WebHomeViewV3);
exports.WebHomeViewV3 = WebHomeViewV3;
let SuccessResult = class SuccessResult extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, 'bool', 'optional', false)
], SuccessResult.prototype, "isFeaturedUpdated", void 0);
__decorate([
    light_1.Field.d(6, TitleRankingView, 'optional', null)
], SuccessResult.prototype, "titleRankingView", void 0);
__decorate([
    light_1.Field.d(8, TitleDetailView, 'optional', null)
], SuccessResult.prototype, "titleDetailView", void 0);
__decorate([
    light_1.Field.d(10, MangaViewer, 'optional', null)
], SuccessResult.prototype, "mangaViewer", void 0);
__decorate([
    light_1.Field.d(25, AllTitlesViewV2, 'optional', null)
], SuccessResult.prototype, "allTitlesViewV2", void 0);
__decorate([
    light_1.Field.d(31, WebHomeViewV3, 'optional', null)
], SuccessResult.prototype, "webHomeViewV3", void 0);
SuccessResult = __decorate([
    light_1.Type.d('SuccessResult')
], SuccessResult);
exports.SuccessResult = SuccessResult;
let MangaPlusResponse = class MangaPlusResponse extends light_1.Message {
};
__decorate([
    light_1.Field.d(1, SuccessResult, 'optional', null)
], MangaPlusResponse.prototype, "success", void 0);
__decorate([
    light_1.Field.d(2, ErrorResult, 'optional', null)
], MangaPlusResponse.prototype, "error", void 0);
MangaPlusResponse = __decorate([
    light_1.Type.d('MangaPlusResponse')
], MangaPlusResponse);
exports.MangaPlusResponse = MangaPlusResponse;
