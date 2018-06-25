const cp = require('child_process')
const { resolve } = require('path')

// api调用 开启子进程
;(async () => {
    const srcipt = resolve(__dirname,'../crawler/video')
    const child = cp.fork(srcipt,[])
    let invoked = false
    
    child.on('err', err => {
      if(invoked) return 
      invoked = true
      console.log(err)
    })

    child.on('exit', code => {
        if(invoked) return
        invoked = true
        console.log(code)
    })

    child.on('message', data => {     
        console.log(data)
    })
})()