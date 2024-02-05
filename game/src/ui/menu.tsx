import { Component, h } from "preact";

export class Menu extends Component<{onPlay: () => void}> {
    render() {
        return (
            <div id="intro">
                <h1>LFM Higher Lower</h1>
                <p>The game is simple, you will be shown an artist, and your job is to guess if that artist has more or less <b>total</b> scrobbles than the previous artist.</p>
                <button onClick={this.props.onPlay}>Play</button>
            </div>
        );
    }
}