import jsonp from './ijsonp'
import {commonParams, options} from './config'

export function getVkey () {
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  let params = {
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"4840101680","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"4840101680","songmid":["003teD5n44Tqbm"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
  }
  return jsonp(url, Object.assign({}, commonParams, params), options)
}