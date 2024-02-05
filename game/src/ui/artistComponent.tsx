import { Artist } from "data.ts";
import { h } from "preact";
export function ArtistView(props: {artist: Artist, obfuscated?: boolean}) {
    return (
        <div class='artist'>
            <p class='name'>
                {props.artist.name}<br/>
            </p>
            {props.artist.idx < 50 && !props.obfuscated &&
                <p class='rank counter'><span class='number'>#{props.artist.idx + 1}</span><span class='unit'>in the world</span></p> }
            <p class='scrobbles counter'><span class='number'>{props.obfuscated ? '???' : props.artist.scrobbles.toLocaleString()}</span><span class='unit'>scrobbles</span></p>
            <p class='listeners counter'><span class='number'>{props.obfuscated ? '???' : props.artist.listeners.toLocaleString()}</span><span class='unit'>listeners</span></p>
        </div>
    )
}