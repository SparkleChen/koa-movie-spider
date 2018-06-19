const puppeteer = require('puppeteer')
const url = `https://movie.douban.com/tag/#/?sort=T&range=9,10&tags=&start=0`

const sleep = time => new Promise(resolve => {
    setTimeout(resolve,time)
})

;(async () => {
    console.log('Start')
    const browser =  await puppeteer.launch({
        args:['--no-sandbox'],
        dumpio:false,
        headless:false
    })

    const page = await browser.newPage(url)

    await page.goto(url,{
        waitUntil:'networkidle2'
    })

    await sleep(3000)
    
    await page.waitForSelector('.more')

     for(let i = 0; i<1; i++){ 
         await page.click('.more')  
         await sleep(3000)     
     }

    const result = await page.evaluate(() => {
        var $ = window.$
        var items = $('.list-wp a')
        var links = []

        if(items.length >=1 ){
        items.each((index,item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio','l_ratio')

        links.push({
            doubanId,
            title,
            rate,
            poster
        })
       })
    }
    return links
    })
    browser.close()
    process.send({result})
    process.exit(0)
})()