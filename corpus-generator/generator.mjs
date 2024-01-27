import fs from "fs";

const API_KEY = process.env.LASTFM_API_KEY; //b123054f373be30e2e115a6d1a4c251a
/**
 * Query the last.fm API for the top artists
 * @param {number} page 
 */
function fetchTopArtists(page=1) {
    console.log(`Fetching page ${page}`);
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=99&page=${page}`)
        .then(res => res.json())
        .then(res => {
            if (!res.artists || !res.artists.artist) throw new Error(JSON.stringify(res));
            return res;
        })
        .then(res => res.artists.artist)
        .then(artists => {
            if (artists.length != 99) console.warn(`Page ${page} has ${artists.length} artists`);
            return artists;
        })
        .then(artists => artists.map(artist => ({
            name: artist.name,
            playcount: parseInt(artist.playcount),
            listeners: parseInt(artist.listeners),
            url: artist.url,
        })))
}

/**
 * Get the top x artists from last.fm
 * @param {number} number Number of artists to get - rounded up to the nearest 99 
 */
async function getTopArtists(number=1000) {
    let pages = Math.ceil(number/99);
    let artists = [];
    for(let i = 1; i <= pages; i++) {
        try {
            artists.push(await fetchTopArtists(i));
        } catch(e) {
            console.error(e);
            i--;
        }
    }
    return artists.flat().sort((a, b) => b.playcount - a.playcount);
}
let artists = await getTopArtists(1000)
let data = 
    artists
    .map(artist => 
        [artist.name,artist.playcount, artist.listeners]
        .join("\t")
    )
    .join("\n")
fs.writeFileSync("artists.tsv", data);