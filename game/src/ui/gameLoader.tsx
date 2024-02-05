import { Component, h } from "preact";
import { data } from "../data.ts";
import { Game } from "./game.tsx";

export class GameLoader extends Component<{}, {data: Awaited<typeof data>}> {
    async componentDidMount() {
        data.then(data => this.setState({data}));
    }
    render() {
        if (this.state.data) return <Game data={this.state.data} />;
        else return <div>Loading...</div>;
    }
}