import nearley from 'nearley'
import mooo from 'moo'

function get_exports(source) {
    let moo = mooo
    let module = { exports: '' }
    eval(source)
    return module.exports
}

onmessage = function({ data }) {
    let outputs = []

    const { source, test } = data

    try {
        let parser = new nearley.Parser(get_exports(source))
        parser.feed(test)
        outputs = parser.results 
        outputs = JSON.parse(JSON.stringify(outputs));
    } catch (e) {
        console.log(e)
    }

    postMessage(outputs)
}
