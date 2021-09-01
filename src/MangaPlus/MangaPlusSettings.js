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
exports.resetSettings = exports.contentSettings = exports.getResolution = exports.getSplitImages = exports.getLanguages = void 0;
const MangaPlusHelper_1 = require("./MangaPlusHelper");
const getLanguages = (stateManager) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield stateManager.retrieve('languages')) || ['en'];
});
exports.getLanguages = getLanguages;
const getSplitImages = (stateManager) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield stateManager.retrieve('splitImages')) || true;
});
exports.getSplitImages = getSplitImages;
const getResolution = (stateManager) => __awaiter(void 0, void 0, void 0, function* () {
    return ((yield stateManager.retrieve('imageResolution')) || ['High']);
});
exports.getResolution = getResolution;
const contentSettings = (stateManager) => {
    return createNavigationButton({
        id: 'content_settings',
        value: '',
        label: 'Content Settings',
        form: createForm({
            onSubmit: (values) => {
                return Promise.all([
                    stateManager.store('languages', values.languages),
                    stateManager.store('splitImages', values.splitImages),
                    stateManager.store('imageResolution', values.imageResolution)
                ]).then();
            },
            validate: () => {
                return Promise.resolve(true);
            },
            sections: () => {
                return Promise.resolve([
                    createSection({
                        id: 'content',
                        rows: () => {
                            return Promise.all([
                                (0, exports.getLanguages)(stateManager),
                                (0, exports.getSplitImages)(stateManager),
                                (0, exports.getResolution)(stateManager)
                            ]).then((values) => __awaiter(void 0, void 0, void 0, function* () {
                                return [
                                    createSelect({
                                        id: 'languages',
                                        label: 'Languages',
                                        options: MangaPlusHelper_1.LangCode,
                                        displayLabel: (option) => {
                                            switch (option) {
                                                case 'en':
                                                    return 'English';
                                                case 'es':
                                                    return 'Español';
                                                case 'fr':
                                                    return 'French';
                                                case 'id':
                                                    return 'Bahasa (IND)';
                                                case 'pt':
                                                    return 'Portugûes (BR)';
                                                case 'ru':
                                                    return 'Русский';
                                                case 'th':
                                                    return 'ภาษาไทย';
                                                default:
                                                    return '';
                                            }
                                        },
                                        value: values[0],
                                        allowsMultiselect: true,
                                        minimumOptionCount: 1
                                    }),
                                    createSwitch({
                                        id: 'splitImages',
                                        label: 'Split double pages',
                                        value: values[1]
                                    }),
                                    createSelect({
                                        id: 'imageResolution',
                                        label: 'Image resolution',
                                        options: ['Low', 'High', 'Super High'],
                                        displayLabel: (option) => option,
                                        value: values[2]
                                    })
                                ];
                            }));
                        }
                    })
                ]);
            }
        })
    });
};
exports.contentSettings = contentSettings;
const resetSettings = (stateManager) => {
    return createButton({
        id: 'reset',
        label: 'Reset to Default',
        value: '',
        onTap: () => {
            return Promise.all([
                stateManager.store('languages', null),
                stateManager.store('splitImages', null),
                stateManager.store('imageResolution', null)
            ]);
        }
    });
};
exports.resetSettings = resetSettings;
