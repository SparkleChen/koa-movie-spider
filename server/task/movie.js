const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
    const srcipt = resolve(__dirname,'../crawler/trailer-list')
    const child = cp.fork(srcipt,[])
    let invoked = false
    
    child.on('err', err => {
      if(invoked) return 
      invoked = true
      console.log(err)
    })

    child.on('exit', code => {
        if(invoked) return
        invoked = false
        console.log(code)
    })

    child.on('message', data => {
        let result = data.result
        console.log(result)
    })
})()