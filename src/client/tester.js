import React, {Component} from 'react'
import nearley from 'nearley'
import Inspector from 'react-inspector'

export default class Tester extends Component {
    state = {
        tests: [''],
    };
    componentDidMount(){
        if(localStorage.tests) this.setState({
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
    deleteTest(i){
        let {tests} = this.state
        let changed = tests.slice(0)
        changed.splice(i, 1)
        this.setState({tests: changed})
    }
    addTest(){
        let {tests} = this.state
        this.setState({tests: [...tests, '']})
    }
    render(){
        return <div className='tester' onKeyPress={e => {
            if(e.key === 'Enter') this.addTest()
        }}>
            <div className='tests'>
                {this.state.tests.map((t, i) => 
                    <Test grammar={this.props.grammar} 
                        key={i}
                        setTest={this.setTest.bind(this,i)}
                        deleteTest={this.deleteTest.bind(this,i)}
                        test={t}/>
                )}
            </div>
            <div className='test-add'
                onClick={this.addTest.bind(this)}>+ Add Test</div>
        </div>
    }
}

class Test extends Component {
    componentDidMount(){
        this.refs.input.focus()
    }
    keyDown(e){
        if(e.key === "Backspace" && e.target.value === '')
            this.props.deleteTest()
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

        return <div className={'test ' + (output ? 'match' : '')}>
            <div className='test-x' onClick={this.props.deleteTest}>
                <div>{'\u00d7'}</div>
            </div>
            <input 
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