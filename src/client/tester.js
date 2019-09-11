import React, { Component } from "react"
import nearley from "nearley"
import Inspector from "react-inspector"
import gen from "./generate.js"
import mooo from "moo"

export default class Tester extends Component {
  // state = {
  //     tests: ['1 + 1', 'ln(5 + sin(3 + 4*e))'],
  // };
  setTest(i, test) {
    let { tests } = this.props
    let changed = tests.slice(0)
    changed[i] = test
    this.props.setTests(changed)
  }

  deleteTest(i, shouldFocus = false) {
    let { tests } = this.props
    let changed = tests.slice(0)
    changed.splice(i, 1)
    this.props.setTests(changed)
    if (shouldFocus === true)
      setImmediate(e => {
        this.refs["test" + Math.min(i, changed.length - 1)].focus()
      })
  }

  addTest() {
    let { tests } = this.props
    this.props.setTests([...tests, ""])
    setImmediate(e => {
      this.refs["test" + tests.length].focus()
    })
  }

  genTest() {
    let grammar = get_exports(this.props.grammar)

    if (grammar.Lexer && grammar.Lexer.re) {
      grammar.ParserStart = grammar.Lexer.re
    }

    let example = gen(grammar, grammar.ParserStart)
    let { tests } = this.props
    this.props.setTests([...tests, example])
  }

  downloadCompiled() {
    const { grammar } = this.props
    const element = document.createElement("a")
    const file = new Blob([grammar], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "grammar.js"
    element.click()
    URL.revokeObjectURL(element.href)
  }

  render() {
    // let grammar = get_exports(this.props.grammar)

    return (
      <div
        className="tester"
        onKeyPress={e => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault()
            this.addTest()
          }
        }}
      >
        <div className="tests">
          {this.props.tests.map((t, i) => (
            <Test
              grammar={this.props.grammar}
              setErrors={this.props.setErrors}
              key={i}
              ref={"test" + i}
              setTest={this.setTest.bind(this, i)}
              deleteTest={this.deleteTest.bind(this, i)}
              test={t}
            />
          ))}
        </div>
        <div className="test-create">
          <div className="test-button" onClick={this.addTest.bind(this)}>
            + Add Test
          </div>
          <div className="test-button" onClick={this.genTest.bind(this)}>
            Generate
          </div>
          <div
            className="test-last-button"
            onClick={this.downloadCompiled.bind(this)}
          >
            Download JS
          </div>
        </div>
      </div>
    )
  }
}

function get_exports(source) {
  let moo = mooo
  let module = { exports: "" }
  eval(source)
  return module.exports
}

class Test extends Component {
  state = { outputs: [] }
  worker = new Worker("./dist/worker.bundle.js")

  focus() {
    this.refs.input.focus()
  }

  keyDown(e) {
    if (e.key === "Backspace" && e.target.value === "")
      this.props.deleteTest(true)
  }

  runTest(t) {
    this.setState({
      testingTest: t,
      testingGrammar: this.props.grammar
    })

    new Promise((res, rej) => {
      this.worker.postMessage({ test: t, source: this.props.grammar })
      this.worker.onmessage = e => {
        res(e.data)
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.worker.terminate()
        this.worker = new Worker("./dist/worker.bundle.js")
        rej(
          "Possible infinite loop detected! Check your grammar for infinite recursion."
        )
      }, 5000)
    })
      .then(outputs => this.setState({ outputs }))
      .catch(e => {
        console.warn(e)
        this.props.setErrors(e)
        this.setState({ outputs: [] })
      })
  }

  setTest(t) {
    this.props.setTest(t)
    this.runTest(t)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    this.worker.terminate()
  }

  render() {
    let { outputs } = this.state
    if (
      this.state.testingTest != this.props.test ||
      this.state.testingGrammar != this.props.grammar
    ) {
      this.runTest(this.props.test)
    }

    setImmediate(e => {
      if (!this.refs.input) return
      this.refs.input.style.height = 0
      this.refs.input.style.height = this.refs.input.scrollHeight
    })

    return (
      <div className={"test " + (outputs.length > 0 ? "match" : "")}>
        <div className="test-x" onClick={this.props.deleteTest}>
          <div>{"\u00d7"}</div>
        </div>
        <textarea
          ref="input"
          placeholder="Type a test..."
          onChange={e => this.setTest(e.target.value)}
          value={this.props.test}
          onKeyDown={this.keyDown.bind(this)}
        />
        {outputs.map((output, i) => (
          <div className="output" key={i}>
            <Inspector data={output} />
          </div>
        ))}
      </div>
    )
  }
}
