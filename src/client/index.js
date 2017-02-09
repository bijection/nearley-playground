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
            <div className='header'>
                <div className='title-wrap'>
                    <span className='title'>Nearley Parser Playground</span>
                </div>
                <div>Experiment with <a href='https://hardmath123.github.io/'>Hardmath123</a>'s incredible <a href="http://nearley.js.org/">Nearley Parser</a>. Nearley will parse anything you throw at it (including ambiguous grammars!) without complaining or going into a <s>sulk</s> infinite loop. The Nearley syntax spec is <a href='https://github.com/Hardmath123/nearley#parser-specification'>here</a>. If you like playgrounds and stuff, consider <a href='https://twitter.com/intent/follow?user_id=4033676687'>following me on twitter</a>!</div>
                <div className='titles'>
                    <div className='grammar-title'>
                        <div className='lp'>Grammar <span className='grey'>(autosaved to localStorage)</span></div>
                    </div>
                    <div className='examples-title'>
                        <div className='subtitle'>Tests <span className='grey'>(autosaved to localStorage)</span></div>
                    </div>
                </div>
            </div>
            <div className='playground-body'>
                <Editor setGrammar={grammar=>this.setState({grammar})}/>
                <Tester grammar={this.state.grammar}/>
            </div>
        </div>
    }
}

ReactDOM.render(<Playground/>, document.getElementById('mount'))