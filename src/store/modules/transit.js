export default {
    state: {
        disc: {},
        singer: {},
        toplist: {},
        vkey: ''
    },
    getters: {
        disc: state => state.disc,
        singer: state => state.singer,
        toplist: state => state.toplist,
        vkey: state => state.vkey
    },
    mutations: {
        SET_DISC (state, disc) {
            state.disc = disc
        },
        SET_SINGER (state, singer) {
            state.singer = singer
        },
        SET_TOPLIST (state, toplist) {
            state.toplist = toplist
        },
        SET_VKEY (state, vkey) {
            state.vkey = vkey
        }
    }
}