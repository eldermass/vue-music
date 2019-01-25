class Storage {
    constructor (storeKey) {
        this.storeKey = storeKey
        this.initJSON()
    }
    initJSON () {
        try {
            this.iJSON = localStorage[this.storeKey] ? JSON.parse(localStorage[this.storeKey]) : []
        } catch (e) {
            this.iJSON = []
        }
    }
    set (value) {
        try {
            localStorage[this.storeKey] = JSON.stringify(value)
            this.iJSON = value.slice()
        } catch (e) {
            console.log(e)
        }
    }
    get () {
        return this.iJSON
    }
}

export default Storage