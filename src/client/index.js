import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import Editor from './editor'
import Tester from './tester'

import "./main.css"

class Playground extends Component {
    state={
        grammar: undefined
    };
    render(){
        return <div className='playground'>
            <Editor setGrammar={grammar=>this.setState({grammar})}/>
            <Tester grammar={this.state.grammar}/>
        </div>
    }
}

ReactDOM.render(<Playground/>, document.getElementById('mount'))