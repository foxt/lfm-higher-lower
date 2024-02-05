import { Component, Fragment, createRef, h } from "preact";
import { playSound } from "../audio.ts";
import { getRandomArtist, type Artist, type data } from "../data.ts";
import { ArtistView } from "./artistComponent.tsx";
import { ShareLinks } from "./shareLinks.tsx";

type Props = {
    data: Awaited<typeof data>;
};


const Footer = () => <>
    <ShareLinks text={`lastfm higher lower game - can you beat my score of ${parseInt(localStorage.getItem('highscore') || '0')}?`}/>
    <p>by <a href="https://foxt.dev" target="_blank">foxt</a> &bull; not associated or endorsed by last.fm &bull; consider <a href='https://github.com/sponsors/foxt' target='_blank'>supporting ❤️</a></p>
</>
export class Game extends Component<Props, {
    history: Artist[];
    previous: Artist;
    current: Artist;
    score: number;
    wasCorrect?: "yes" | "no" ;
    lives: number;
}> {
    constructor(props: Props) {
        super();
        this.props = props;
        this.state = this.startGame();
    }
    startGame() {
        let previous = getRandomArtist(this.props.data);
        let current = getRandomArtist(this.props.data);
        return {previous, current, history: [previous], score: 0, lives: 3, wasCorrect: undefined};
    }
    choicesRef = createRef();
    render() {
        let prev = this.state.previous;
        return (
            <div class='gameContainer'>
                <div class='historyView'>
                    {this.state.history.map(artist => 
                        <div 
                            class='historyEntry' 
                            data-selected={prev == artist} 
                            data-wasCorrect={this.state.wasCorrect}
                            key={artist.name}
                            ref={prev == artist ? (el) => el && el.scrollIntoView({behavior: 'smooth', block: 'center'}) : undefined}
                        >
                            <ArtistView artist={artist} />
                        </div>    
                    )}
                </div>
                <div class='playView'>
                    {this.state.lives > 0 ?
                        <>
                            <div>
                                <h1>{'❤︎'.repeat(this.state.lives)}</h1>
                                <h2>Score: {this.state.score} </h2>
                                <h3>Highscore: {localStorage.getItem('highscore')}</h3>
                            </div>
                            <div>
                                <p class='instruction'>Who has more listens?</p>
                                <div class='choices' ref={this.choicesRef}>
                                    <button onClick={() => this.guess(false)}>
                                        <ArtistView artist={this.state.previous} />
                                    </button>
                                    <button onClick={() => this.guess(true)}>
                                        <ArtistView artist={this.state.current} obfuscated/>
                                    </button>
                                </div>
                            </div>
                            <div class='hideSmall'>
                                <Footer/>
                            </div>
                        </> : <>
                            <p>Game over! Your score was {this.state.score} - highest: {localStorage.getItem('highscore')}</p>
                            <button onClick={() => this.setState(this.startGame())}>
                                Play again
                            </button>
                            <div>
                                <Footer/>
                            </div>
                        </>}
                </div>
                
                    
            </div>
        )
    }
    guess(higher: boolean) {
        let correct;
        if (higher) {
            correct = this.state.current.scrobbles >= this.state.previous.scrobbles;
        } else {
            correct = this.state.current.scrobbles <= this.state.previous.scrobbles;
        }
        let score = this.state.score + (correct ? 1 : 0);
        let lives = this.state.lives + (correct ? 0 : -1);
        let previous = this.state.current;
        let history = [...this.state.history, previous].sort((a, b) => b.scrobbles - a.scrobbles);
        let current: Artist;
        let now = performance.now()
        do {
            current = getRandomArtist(this.props.data);
            if (performance.now() - now > 1000) {
                alert("Congratulations! You broke the game! You're winner!");
                location.replace("https://youtu.be/9zb018dn5qw");
                break;
            }
        } while (history.find((a) => a.name == current.name) || current.name == previous.name);
        this.choicesRef.current.dataset.wasCorrect = correct ? "yes" : "no";
        this.choicesRef.current.classList.add("animate")
        this.setState({ previous, history, score, wasCorrect : correct ? "yes" : "no", lives});

        if (correct) {
            playSound("correct")
        } else {
            if (lives > 0) {
                playSound("wrong")
            } else {
                playSound("fail")
            }
        }

        if (parseInt(localStorage.getItem('highscore') || '0') < score) {
            localStorage.setItem('highscore', score.toString());
        }

        setTimeout(() => {
            this.setState({current,previous});
            this.choicesRef.current.classList.remove("animate");
        }, 250);
    }

}