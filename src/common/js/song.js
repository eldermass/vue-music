function Song ({id, mid, singer, name, album, duration, image, url}) {
  this.id = id
  this.mid = mid
  this.singer = singer
  this.name = name
  this.album = album
  this.duration = duration
  this.image = image
  this.url = url
}
const vkey = 'ABC'
export function createSong (songitem) {
  return new Song({
    id: songitem.songid,
    mid: songitem.songmid,
    singer: songitem.singer,
    name: songitem.songname,
    album: songitem.albumname,
    duration: songitem.interval,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${songitem.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${songitem.strMediaMid}.m4a?guid=4840101680&vkey=${vkey}&uin=0&fromtag=38`
  })
}
