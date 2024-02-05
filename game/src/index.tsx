import { Component, h, render } from 'preact';
import { GameLoader } from 'ui/gameLoader.tsx';
import { Menu } from 'ui/menu.tsx';

class App extends Component<{}, {isPlaying: boolean}> {
  constructor() {
    super();
    this.state = {isPlaying: true};
  }
  render() {
    if (this.state.isPlaying) return <GameLoader />;
    else return <Menu onPlay={() => this.setState({isPlaying: true})} />;
  }
}

render(<App />, document.getElementById('root')!);