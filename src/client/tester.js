import React, {Component} from 'react'
import nearley from 'nearley'
import Inspector from 'react-inspector'
import gen from './generate.js'

export default class Tester extends Component {
    state = {
        tests: ['1 + 1', 'ln(5 + sin(3 + 4*e))'],
    };
    componentDidMount(){
        if(localStorage.tests && JSON.parse(localStorage.tests).length) this.setState({
            tests: JSON.parse(localStorage.tests)
        })
    }
    componentWillUpdate(_ ,nextState){
        localStorage.tests = JSON.stringify(nextState.tests)
    }
    setTest(i, test){
        let {tests} = this.state
        let changed = tests.slice(0)
        changed[i] = test
        this.setState({tests: changed})
    }
    deleteTest(i, shouldFocus=false){
        let {tests} = this.state
        let changed = tests.slice(0)
        changed.splice(i, 1)
        this.setState({tests: changed})
        console.log(shouldFocus)
        if(shouldFocus === true) setImmediate(e => {
            this.refs['test'+Math.min(i,changed.length - 1)].focus()
        })
    }
    addTest(){
        let {tests} = this.state
        this.setState({tests: [...tests, '']})
        setImmediate(e => {
            this.refs['test'+tests.length].focus()
        })
    }
    genTest(){
        let grammar = this.props.grammar
        let example = gen(grammar, grammar.ParserStart);
        let {tests} = this.state
        this.setState({tests: [...tests, example]})
    }
    render(){
        return <div className='tester' onKeyPress={e => {
            if(e.key === 'Enter' && e.shiftKey) {
                e.preventDefault()
                this.addTest()
            }
        }}>
            <div className='tests'>
                {this.state.tests.map((t, i) => 
                    <Test grammar={this.props.grammar} 
                        key={i}
                        ref={'test'+i}
                        setTest={this.setTest.bind(this,i)}
                        deleteTest={this.deleteTest.bind(this,i)}
                        test={t}/>
                )}
            </div>
            <div className='test-create'>
                <div className='test-add'
                    onClick={this.addTest.bind(this)}>+ Add Test</div>
                <div className='test-generate'
                    onClick={this.genTest.bind(this)}>Generate</div>
            </div>
        </div>
    }
}

class Test extends Component {
    focus(){
        this.refs.input.focus()
    }
    keyDown(e){
        if(e.key === "Backspace" && e.target.value === '')
            this.props.deleteTest(true)
    }
    render(){
        let output;

        try {
            let {ParserRules, ParserStart} = this.props.grammar        
            let parser = new nearley.Parser( ParserRules, ParserStart )
            parser.feed(this.props.test)
            output = parser.results[0]
        } catch(e) {
            // console.log(e, this.props)
        }

        setImmediate(e => {
            if(!this.refs.input) return
            this.refs.input.style.height = 0
            this.refs.input.style.height = this.refs.input.scrollHeight
        })

        return <div className={'test ' + (output ? 'match' : '')}>
            <div className='test-x' onClick={this.props.deleteTest}>
                <div>{'\u00d7'}</div>
            </div>
            <textarea 
                ref='input'
                placeholder="Type a test..."
                onInput={e => this.props.setTest(e.target.value)}
                onChange={e => this.props.setTest(e.target.value)}
                value={this.props.test}
                onKeyDown={this.keyDown.bind(this)}
                />
            <div className='output'><Inspector data={output}/></div>
        </div>
    }
}