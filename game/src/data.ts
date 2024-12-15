async function fetchLatestFile() {
    let latest = await fetch("https://lfmhigherlower.blob.core.windows.net/data/latest");   
    if (!latest.ok) {
        throw new Error("Failed to fetch latest file");
    }
    let fn = await latest.text();
    let data = await fetch(`https://lfmhigherlower.blob.core.windows.net/data/${fn}`);
    if (!data.ok) {
        throw new Error("Failed to fetch data file");
    }
    let text = await data.text();
    localStorage.setItem("data", text);
    localStorage.setItem("lastChecked", Date.now().toString());
    return text;
}

async function fetchData() {
    let lastChecked = parseInt(localStorage.getItem("lastChecked") as string);
    let now = Date.now();
    let data: string | null = null;
    if (isNaN(lastChecked) || (now - lastChecked) > 1000 * 60 * 60 * 24) {
        try {
            data = await fetchLatestFile()
        } catch(e) {
            console.error(e);
        }
    }
    if (!data) {
        data = localStorage.getItem("data");
    }
    return data && data.split("\n");
}

export const data = fetchData();

export interface Artist {
    idx: number;
    name: string;
    scrobbles: number;
    listeners: number;

}

export function getArtistByIdx(d: Awaited<typeof data>, idx: number): Artist {
    let [name,scrobbles,listeners] = d[idx].split("\t");
    return {
        name, idx,
        scrobbles: parseInt(scrobbles),
        listeners: parseInt(listeners),
    };
}

export function getRandomArtist(d: Awaited<typeof data>): Artist {
    return getArtistByIdx(d, Math.floor(Math.random() * d.length));
}