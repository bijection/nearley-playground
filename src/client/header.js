import React, {Component} from 'react'
import nearley from 'nearley'
import Inspector from 'react-inspector'


export default class Header extends Component{
    state={hidden: false};
    render(){
        return <div className='header'>
            <div 
                onClick={e => this.setState({hidden: !this.state.hidden})}
                className={this.state.hidden ? 'show' : 'hide'}
                >
                {this.state.hidden 
                    ? <div>Nearley Parser Playground <span className='grey'>(click to show header)</span></div>
                    : '[hide header]'}
            </div>
            {this.state.hidden
                ? ''
                : <div>
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
                </div>}
        </div>
    }
}
