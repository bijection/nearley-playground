import nearley from 'nearley'

function get_exports(source){
    let module = {exports:''}
    eval(source)
    return module.exports
}

onmessage = function({data}){
    let outputs = [];

    console.log('hi', data)

    const {source, test} = data


    try {
        let parser = new nearley.Parser( get_exports(source) )
        parser.feed(test)
        outputs = parser.results
    } catch(e) {
        console.log(e)
    }

    console.log(outputs)

    postMessage(outputs)
}