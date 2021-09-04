import {
    Chapter,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    Tag,
    TagSection
} from 'paperback-extensions-common'
import {reverseLangCode} from './Languages'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('./external/crypto.min.js')

export class Parser {


    parseMangaDetails($: any, mangaId: string): Manga {

        const titles = [this.decodeHTMLEntity($('a', $('.item-title')).text().trim())]
        const altTitles: string[] = $('.alias-set').text().split('/').map((s: string) => s.trim()) ?? ''
        for (const title of altTitles)
            titles.push(this.decodeHTMLEntity(title))

        const image = $('.shadow-6').attr('src')

        const summary = $('pre', $('.attr-main')).text().trim()

        let status = MangaStatus.ONGOING, author, released, views = 0, isHentai = false
        const rating = 0

        let tagArray0: Tag[] = []
        let i = 0
        for (const item of $('.attr-item').toArray()) {
            const itemSpan = $('span', $(item))
            switch (i) {
                case 0: {
                    // Views
                    views = parseInt($(itemSpan).text().split('/')[1].trim())
                    i++
                    continue
                }
                case 1: {
                    // Author
                    const authorList: any = $('a', $(itemSpan))
                    author = authorList.map((_i: any, elem: any) => $(elem).text()).get().join(', ') ?? ''
                    i++
                    continue
                }
                case 2: {
                    // Genres
                    for (const obj of $(itemSpan).children().toArray()) {
                        const label = $(obj).text().trim()
                        if (typeof label === 'undefined') {
                            i++
                            continue
                        }
                        tagArray0 = [...tagArray0, createTag({id: label, label: label})]
                    }
                    i++
                    continue
                }
                case 3: {
                    i++
                    continue
                }
                case 4: {
                    // Status
                    if ($(itemSpan).text().toLowerCase().includes('ongoing')) {
                        status = MangaStatus.ONGOING
                    } else {
                        status = MangaStatus.COMPLETED
                    }
                    i++
                    continue
                }
                case 5: {
                    // Date of release
                    released = ($(itemSpan).text().trim()) ?? undefined
                    i++
                    continue
                }
                case 6: {
                    // Hentai
                    if ($(itemSpan).text()[0] == 'G') {
                        isHentai = true
                    }
                    i++
                    continue
                }
            }
            i = 0
        }
        const tagSections: TagSection[] = [createTagSection({id: '0', label: 'genres', tags: tagArray0})]
        return createManga({
            id: mangaId,
            rating: rating,
            titles: titles,
            image: image ?? '',
            status: status,
            author: this.decodeHTMLEntity(author ?? ''),
            tags: tagSections,
            desc: this.decodeHTMLEntity(summary),
            lastUpdate: released,
            hentai: isHentai,
            views: views
        })
    }


    parseChapterList($: any, mangaId: string, source: any): Chapter[] {
        const chapters: Chapter[] = []

        const theArray = $('.item', $('.main')).toArray().reverse()
        theArray.forEach((obj: any, i: number) =>  {
            const chapterTile: any = $('a', $(obj))
            const chapterId = chapterTile.attr('href')?.replace('/chapter/', '')
            const chapGroup = $(chapterTile).text().trim().split('\n').pop()?.trim()
            const chapNamePart1 = $('b', chapterTile).text()
            let chapNamePart2 = $('span', $(chapterTile)).first().text().replace(':', '').trim()
            if (chapNamePart2 == chapGroup) chapNamePart2 = ''
            const chapter = $('b', chapterTile).text()
            const chapNum = i+1
            const volume = Number(chapter?.split('chapter')[0]?.replace('volume', '').trim())
            
            const language = $('.emoji').attr('data-lang') ?? 'gb'
            const time = source.convertTime($('i.ps-3', $(obj)).text())
            if ((typeof chapterId === 'undefined')) return
            
            chapters.push(createChapter({
                id: chapterId,
                mangaId: mangaId,
                volume: Number.isNaN(volume) ? 0 : volume,
                chapNum: Number(chapNum),
                group: this.decodeHTMLEntity(chapGroup ?? ''),
                langCode: reverseLangCode[language] ?? LanguageCode.UNKNOWN,
                name: chapNamePart1 + ' ' + this.decodeHTMLEntity(chapNamePart2),
                time: time
            }))
        })
        return chapters
    }

    parseChapterDetails($: any): string[] {
        const pages: string[] = []

        // Get all of the pages
        const scripts = $('script').toArray()
        for (const scriptObj of scripts) {
            const script = scriptObj.children[0]?.data
            if (typeof script === 'undefined') continue
            if (script.includes('var images =')) {
                const imgJson = JSON.parse(script.split('var images = ', 2)[1].split(';', 2)[0] ?? '') as any
                const imgNames = imgJson.names()

                if (imgNames != null) {
                    for (let i = 0; i < imgNames.length(); i++) {
                        const imgKey = imgNames.getString(i)
                        const imgUrl = imgJson.getString(imgKey)
                        pages.push(imgUrl)
                    }
                }

            } else if (script.includes('const server =')) {
                const encryptedServer = (script.split('const server = ', 2)[1].split(';', 2)[0] ?? '').replace(/"/g, '')
                const batoJS = eval(script.split('const batojs = ', 2)[1].split(';', 2)[0] ?? '').toString()
                const decryptScript = CryptoJS.AES.decrypt(encryptedServer, batoJS).toString(CryptoJS.enc.Utf8)
                const server = decryptScript.toString().replace(/"/g, '')
                const imgArray = JSON.parse(script.split('const images = ', 2)[1].split(';', 2)[0] ?? '') as any
                if (imgArray != null) {
                    if (script.includes('bato.to/images')) {
                        for (let i = 0; i < imgArray.length; i++) {
                            const imgUrl = imgArray[i]
                            pages.push(`${imgUrl}`)
                        }
                    } else {
                        for (let i = 0; i < imgArray.length; i++) {
                            const imgUrl = imgArray[i]
                            if (server.startsWith('http'))
                                pages.push(`${server}${imgUrl}`)
                            else
                                pages.push(`https:${server}${imgUrl}`)
                        }
                    }
                }
            }
        }

        return pages
    }

    filterUpdatedManga($: any, time: Date, ids: string[], source: any): { updates: string[], loadNextPage: boolean } {
        const foundIds: string[] = []
        let passedReferenceTime = false
        for (const item of $('.item', $('#series-list')).toArray()) {
            const id = $('a', item).attr('href')?.replace('/series/', '')!.trim().split('/')[0] ?? ''
            const mangaTime = source.convertTime($('i', item).text().trim())
            passedReferenceTime = mangaTime <= time
            if (!passedReferenceTime) {
                if (ids.includes(id)) {
                    foundIds.push(id)
                }
            } else break
        }
        if (!passedReferenceTime) {
            return {updates: foundIds, loadNextPage: true}
        } else {
            return {updates: foundIds, loadNextPage: false}
        }


    }

    parseSearchResults($: any, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = []
        const collectedIds: string[] = []
        for (const obj of $('.item', $('#series-list')).toArray()) {
            const id = $('.item-cover', obj).attr('href')?.replace('/series/', '')!.trim().split('/')[0] ?? ''
            const titleText = this.decodeHTMLEntity($('.item-title', $(obj)).text())
            const subtitle = $('.visited', $(obj)).text().trim()
            const time = source.convertTime($('i', $(obj)).text().trim())
            const image = $('img', $(obj)).attr('src')

            if (typeof id === 'undefined' || typeof image === 'undefined') continue
            if (!collectedIds.includes(id)) {
                mangaTiles.push(createMangaTile({
                    id: id,
                    title: createIconText({text: titleText}),
                    subtitleText: createIconText({text: subtitle}),
                    primaryText: createIconText({text: time.toDateString(), icon: 'clock.fill'}),
                    image: image
                }))
                collectedIds.push(id)
            }
        }
        return mangaTiles
    }

    parseHomePageSection($: any, source: any): MangaTile[] {

        const tiles: MangaTile[] = []
        const collectedIds: string[] = []
        for (const item of $('.item', $('#series-list')).toArray()) {
            const id = $('a', item).attr('href')?.replace('/series/', '')!.trim().split('/')[0] ?? ''
            const titleText = this.decodeHTMLEntity($('.item-title', $(item)).text())
            const subtitle = $('.visited', $(item)).text().trim()
            const time = source.convertTime($('i', $(item)).text().trim())
            const image = $('img', $(item)).attr('src')

            if (typeof id === 'undefined' || typeof image === 'undefined') continue
            if (!collectedIds.includes(id)) {
                tiles.push(createMangaTile({
                    id: id,
                    title: createIconText({text: titleText}),
                    subtitleText: createIconText({text: subtitle}),
                    primaryText: createIconText({text: time.toDateString(), icon: 'clock.fill'}),
                    image: image
                }))
                collectedIds.push(id)
            }
        }
        return tiles
    }

    isLastPage($: any): boolean {
        return $('.page-item').last().hasClass('disabled')

    }

    decodeHTMLEntity(str: string): string {
        return str.replace(/&#(\d+);/g, (_match, dec) => {
            return String.fromCharCode(dec)
        })
    }

}
