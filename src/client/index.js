import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import Header from './header'
import Editor from './editor'
import Tester from './tester'

import "./main.css"

class Playground extends Component {
    state = {
        grammar: undefined,
        highlight: []
    };
    render(){
        return <div className='playground'>
            <Header />
            <div className='playground-body'>
                <Editor setGrammar={grammar => this.setState({grammar})} highlight={this.state.highlight} grammar={this.state.grammar} />
                <Tester grammar={this.state.grammar} setHighlight={highlight => this.setState({ highlight })} />
            </div>
        </div>
    }
}

ReactDOM.render(<Playground/>, document.getElementById('mount'))