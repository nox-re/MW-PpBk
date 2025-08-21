import {
  SourceInfo,
  Source,
  Manga,
  Chapter,
  ChapterDetails,
  MangaStatus,
  ContentRating,
  Language,
  SourceTags,
  Tag,
  Request,
  Response,
  Fetch,
  CheerioAPI,
} from '@paperback/types';

export const MangaWorldInfo: SourceInfo = {
  version: '0.0.1',
  name: 'MangaWorld',
  description: 'Estensione per leggere manga da mangaworld.cx',
  author: 'Giuseppe',
  language: Language.Italian,
  contentRating: ContentRating.Mature,
  websiteBaseURL: 'https://www.mangaworld.cx',
  sourceTags: [SourceTags.MultiPage],
};

export class MangaWorld implements Source {
  getMangaDetails = async (mangaId: string): Promise<Manga> => {
    const response = await Fetch.request(mangaId, {
      method: 'GET',
    });
    const $ = CheerioAPI.load(response.data);

    const title = $('h1').text().trim();
    const image = $('.img-fluid').attr('src') ?? '';
    const description = $('.description').text().trim();
    const tags: Tag[] = [];
    $('.badge.badge-secondary').each((_, el) => {
      tags.push({ id: $(el).text(), label: $(el).text() });
    });

    return {
      id: mangaId,
      title,
      image,
      description,
      status: MangaStatus.Unknown,
      tags,
    };
  };

  getChapters = async (mangaId: string): Promise<Chapter[]> => {
    const response = await Fetch.request(mangaId, {
      method: 'GET',
    });
    const $ = CheerioAPI.load(response.data);
    const chapters: Chapter[] = [];

    $('.list-group-item').each((_, el) => {
      const title = $(el).find('.d-flex > div:first-child').text().trim();
      const url = $(el).attr('href') ?? '';
      const date = $(el).find('.text-right').text().trim();

      chapters.push({
        id: url,
        title,
        langCode: Language.Italian,
        group: '',
        time: new Date(date),
      });
    });

    return chapters;
  };

  getChapterDetails = async (chapterId: string): Promise<ChapterDetails> => {
    const response = await Fetch.request(chapterId, {
      method: 'GET',
      headers: {
        Referer: 'https://www.mangaworld.cx/',
      },
    });
    const $ = CheerioAPI.load(response.data);
    const pages: string[] = [];

    $('.img-fluid').each((_, el) => {
      const src = $(el).attr('data-src') ?? $(el).attr('src');
      if (src) pages.push(src);
    });

    return {
      id: chapterId,
      pages,
      longStrip: true,
    };
  };

  getSearchResults = async (query: string): Promise<Manga[]> => {
    const url = `https://www.mangaworld.cx/search?query=${encodeURIComponent(query)}`;
    const response = await Fetch.request(url, {
      method: 'GET',
    });
    const $ = CheerioAPI.load(response.data);
    const results: Manga[] = [];

    $('.card').each((_, el) => {
      const title = $(el).find('.card-title').text().trim();
      const image = $(el).find('img').attr('data-src') ?? '';
      const link = $(el).find('a').attr('href') ?? '';

      results.push({
        id: link,
        title,
        image,
      });
    });

    return results;
  };
}
