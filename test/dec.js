class Boy {
    @speak('中文')
    run(){
        console.log('I can speaking ' + this.language)
    }
}
function speak(language){
    return function (target,key,descriptor) {
           console.log(target)
           console.log(key)
           console.log(descriptor)
           target.language = language
           return descriptor
        }
} 

const luke = new Boy()

luke.run()