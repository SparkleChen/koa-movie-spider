import './assets/common.sass'

function changeTile (){
    window.$('#app').html('Parcel 打包')
}

setTimeout(function(){
    changeTile()
},2000)