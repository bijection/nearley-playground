import React, {Component} from 'react'
import Header from './header'
import Editor from './editor'
import Tester from './tester'

import "./main.css"

export default class Playground extends Component {
    state={
        grammar: undefined
    };
    render(){
        return <div className='playground'>
            <Header />
            <div className='playground-body'>
                <Editor setGrammar={grammar=>this.setState({grammar})}/>
                <Tester grammar={this.state.grammar}/>
            </div>
        </div>
    }
}