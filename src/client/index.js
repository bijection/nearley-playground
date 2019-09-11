import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import Header from './header'
import Editor from './editor'
import Tester from './tester'
import compile from './high_level_compile'
import arithmetic from './arithmetic.ne'
import sentence from './sentence.ne'
import cloneDeep from 'lodash/cloneDeep'

import "./main.css"

console.log(compile(sentence))


let default_playground_state = {
    active: 0,
    compiled_grammar: compile(sentence).output,
    tabs: [
        {
            name: 'Basic Grammar',
            editor_value: sentence,
            errors: '',
            tests: [
                'Charles sleeps while thinking about snakes.',
                'A typical Reddit user sleeps with a hammer.',
                'This test doesn\'t match :('
            ]
        },
        {
            name: 'Fancier Grammar',
            editor_value: arithmetic,
            errors: '',
            tests: ['1 + 1', 'ln(5 + sin(3 + 4*e))']
        }
    ]
}


if(localStorage.raw_grammar) {

    let c = compile(localStorage.raw_grammar)

    let {errors, output} = c

    default_playground_state = {
        active: 0,
        compiled_grammar: output,
        tabs: [
            {
                name: 'Imported from Previous Version',
                editor_value: localStorage.raw_grammar,
                errors,
                tests: JSON.parse(localStorage.tests)
            }
        ]
    }

    localStorage._backup_grammar = localStorage.raw_grammar
    delete localStorage.raw_grammar

    console.log(c, default_playground_state)
}


const new_tab_grammar = `Main -> "What's up, " Person "?"
Person -> "@biject" | "@antimatter15" | "Hardmath123"
`
const new_tab_grammar_compiled = compile(new_tab_grammar).output

class Playground extends Component {
    state = default_playground_state;
    componentWillMount(){
        if (localStorage.playgroundState){
            this.state = JSON.parse(localStorage.playgroundState)
        }
        // console.log('initial', this.state)
    }
    setTabSizes(){
        this.state.tabs.forEach((t, i) => {
            let ref = this.refs['tab-title-'+i]
            ref.style.width = 0
            ref.style.width = ref.scrollWidth + 2
        })        
    }
    componentDidMount(){
        this.setTabSizes()
    }
    componentWillUpdate(nextProps, nextState){
        localStorage.playgroundState = JSON.stringify(nextState)
    }
    compiled_state(v, i=this.state.active){
        let state = cloneDeep(this.state)
    
        let {output, errors} = compile(v)

        state.tabs[i].editor_value = v
        state.tabs[i].errors = errors || []
        state.compiled_grammar = output

        return state
    }
    setErrors(errors, i=this.state.active){
        let state = cloneDeep(this.state)
    
        state.tabs[i].errors = errors || []

        return this.setState(state)
    }
    setActive(i){

        let state = this.compiled_state(this.state.tabs[i].editor_value, i)
        state.active = i

        this.setState(state)
        // this.compile(this.state.tabs[i].editor_value)
    }
    setTests(tests){
        let state = cloneDeep(this.state)
    
        state.tabs[state.active].tests = tests
        this.setState(state)
    }
    setTabName(i, name){
        let state = cloneDeep(this.state)
        state.tabs[i].name = name
        this.setState(state)
    }
    deleteTab(e, i){
        e.stopPropagation()


        let state = cloneDeep(this.state)
        if(state.tabs.length < 2){
            this.setState({tabs: [{
                name: "Tab 1",
                editor_value: '',
                errors: '',
                tests: []                
            }]})
        } else {
            state.tabs.splice(i, 1)
            state.active = state.active <= i
                ? Math.min(state.active, state.tabs.length - 1)
                : state.active - 1
            state.compiled_grammar = compile(state.tabs[state.active].editor_value).output

            this.setState(state)            

        }

        setImmediate(e => this.setTabSizes())
     
    }
    addTab() {
        let state = cloneDeep(this.state)
        state.compiled_grammar = new_tab_grammar_compiled
        state.tabs.push({
            name: 'Tab '+(state.tabs.length+1),
            editor_value: new_tab_grammar,
            errors: '',
            tests: ['What\'s up, @biject?']
        })
        state.active = state.tabs.length - 1
        this.setState(state)

        setImmediate(e => this.setTabSizes())
    }
    render(){
        let {name, editor_value, errors, tests} = this.state.tabs[this.state.active]
        const {active} = this.state

        return <div className='playground'>
            <Header />
            <div className='tabs'>
                {this.state.tabs.map( 
                    ({name}, i) => <div 
                        key={i}
                        className={'tab' + (active === i ? " active" : "")}
                        onClick={e => this.setActive(i)}>
                        <input 
                            ref={'tab-title-'+i} 
                            value={name} 
                            spellCheck="false"
                            onChange={e => {
                            this.setTabName(i, e.target.value)
                            e.target.style.width = 0
                            e.target.style.width = e.target.scrollWidth + 2
                        }}/>
                        <div className='x' onClick={e => this.deleteTab(e, i)}>
                            <div>{'\u00d7'}</div>
                        </div>
                    </div>
                )}
                <div className='add' onClick={this.addTab.bind(this)}>+ Add Tab</div>
                {this.state.tabs.length == 1 && this.state.tabs[0].editor_value === ''
                    ? <div className='add grey' onClick={e=> {
                        this.setState(default_playground_state)
                        setImmediate(e => this.setTabSizes())
                    }}>Reset Examples?</div>
                    : null }
            </div>
            <div className='playground-body'>

                <Editor 
                    value={editor_value}
                    errors={errors}
                    onChange={v => this.setState(this.compiled_state(v))}
                    grammar={this.state.compiled_grammar}
                />
                <Tester
                    key={active}
                    tests={tests}
                    setErrors={errors => this.setErrors(errors, active)}
                    setTests={e => this.setTests(e)}
                    grammar={this.state.compiled_grammar}
                    />
            </div>
        </div>
    }
}



ReactDOM.render(<Playground/>, document.getElementById('mount'))



