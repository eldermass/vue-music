const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const makeDir = (d) =>{
    //中间件树
    let tree = {}

    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    //遍历文件夹
    dirs.forEach(dir => {
        tree[dir] = makeDir(path.join(d, dir))
    })
    //遍历文件
    files.forEach(file => {
        if(path.extname(file) === '.js'){
            tree[path.basename(file, '.js')] = require(path.join(d, file)) 
        }
    })
    return tree
}

module.exports = makeDir(path.join(__dirname))
