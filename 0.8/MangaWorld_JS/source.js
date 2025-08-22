"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaWorld = exports.MangaWorldInfo = void 0;
const types_1 = require("@paperback/types");
exports.MangaWorldInfo = {
    version: '0.0.1',
    name: 'MangaWorld_JS',
    description: 'Estensione per leggere manga da mangaworld.cx',
    author: '',
    language: types_1.Language.Italian,
    contentRating: types_1.ContentRating.Mature,
    websiteBaseURL: 'https://www.mangaworld.cx',
    sourceTags: [types_1.SourceTags.MultiPage],
};
class MangaWorld {
    constructor() {
        this.getMangaDetails = async (mangaId) => {
            var _a;
            const response = await types_1.Fetch.request(mangaId, {
                method: 'GET',
            });
            const $ = types_1.CheerioAPI.load(response.data);
            const title = $('h1').text().trim();
            const image = (_a = $('.img-fluid').attr('src')) !== null && _a !== void 0 ? _a : '';
            const description = $('.description').text().trim();
            const tags = [];
            $('.badge.badge-secondary').each((_, el) => {
                tags.push({ id: $(el).text(), label: $(el).text() });
            });
            return {
                id: mangaId,
                title,
                image,
                description,
                status: types_1.MangaStatus.Unknown,
                tags,
            };
        };
        this.getChapters = async (mangaId) => {
            const response = await types_1.Fetch.request(mangaId, {
                method: 'GET',
            });
            const $ = types_1.CheerioAPI.load(response.data);
            const chapters = [];
            $('.list-group-item').each((_, el) => {
                var _a;
                const title = $(el).find('.d-flex > div:first-child').text().trim();
                const url = (_a = $(el).attr('href')) !== null && _a !== void 0 ? _a : '';
                const date = $(el).find('.text-right').text().trim();
                chapters.push({
                    id: url,
                    title,
                    langCode: types_1.Language.Italian,
                    group: '',
                    time: new Date(date),
                });
            });
            return chapters;
        };
        this.getChapterDetails = async (chapterId) => {
            const response = await types_1.Fetch.request(chapterId, {
                method: 'GET',
                headers: {
                    Referer: 'https://www.mangaworld.cx/',
                },
            });
            const $ = types_1.CheerioAPI.load(response.data);
            const pages = [];
            $('.img-fluid').each((_, el) => {
                var _a;
                const src = (_a = $(el).attr('data-src')) !== null && _a !== void 0 ? _a : $(el).attr('src');
                if (src)
                    pages.push(src);
            });
            return {
                id: chapterId,
                pages,
                longStrip: true,
            };
        };
        this.getSearchResults = async (query) => {
            const url = `https://www.mangaworld.cx/search?query=${encodeURIComponent(query)}`;
            const response = await types_1.Fetch.request(url, {
                method: 'GET',
            });
            const $ = types_1.CheerioAPI.load(response.data);
            const results = [];
            $('.card').each((_, el) => {
                var _a, _b;
                const title = $(el).find('.card-title').text().trim();
                const image = (_a = $(el).find('img').attr('data-src')) !== null && _a !== void 0 ? _a : '';
                const link = (_b = $(el).find('a').attr('href')) !== null && _b !== void 0 ? _b : '';
                results.push({
                    id: link,
                    title,
                    image,
                });
            });
            return results;
        };
    }
}
exports.MangaWorld = MangaWorld;
