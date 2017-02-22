import React, {Component} from 'react'
import nearley from 'nearley'
import Inspector from 'react-inspector'


export default class Header extends Component{
    state={hidden: false};
    render(){
        return <div className={'header' + (this.state.hidden ? ' small' : '')}>
            <div 
                onClick={e => this.setState({hidden: !this.state.hidden})}
                className={this.state.hidden ? 'show' : 'hide'}
                >
                {this.state.hidden 
                    ? <div><b>⛹ Nearley Parser Playground</b> <span className='grey'>(click to show header)</span></div>
                    : '[hide header]'}
            </div>
            {this.state.hidden
                ? ''
                : <div>
                    <div className='title-wrap'>
                        <span className='title'>⛹ Nearley Parser Playground</span>
                    </div>
                    <div>Experiment with <a href='https://hardmath123.github.io/'>Hardmath123</a>'s incredible <a href="http://nearley.js.org/">Nearley Parser</a>!
                        Nearley will parse anything you throw at it (including ambiguous grammars!) without complaining or going into a <s>sulk</s> infinite loop.
                        You can find the Nearley syntax spec <a href='https://github.com/Hardmath123/nearley#parser-specification'>here</a>, more example grammars <a href='https://github.com/Hardmath123/nearley/tree/master/examples'>here</a>, and this project's repo <a href='https://github.com/bijection/nearley-playground'>here</a>.
                        If you like playgrounds and stuff, consider <a href='https://twitter.com/intent/follow?user_id=4033676687'>following me on twitter</a>!</div>
                    <div className='mobile-info'>
                        Hi there mobile visitor! I've tried to make this usable on smaller screens, but for the best experience, I recommend using a desktop browser (or maybe turning your phone sideways). Sorry for the jank!
                    </div>
                </div>}
        </div>
    }
}
