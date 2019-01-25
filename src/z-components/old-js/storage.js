class Storage {
  constructor (type) {
    this.type = type
    this.searchJSON = localStorage[this.type] ? JSON.parse(localStorage[this.type]) : {}
  }
  set (key, value) {
    let newObj = Object.assign({}, this.searchJSON, {
      [key]: value
    })
    localStorage[this.type] = JSON.stringify(newObj)
  }
  get (key) {
    return this.searchJSON[key] ? this.searchJSON[key] : []
  }
}

export default new Storage('searchHistory')