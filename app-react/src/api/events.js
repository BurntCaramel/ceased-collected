import { fetchJSON, postJSON } from './init'


export function list() {
  return fetchJSON('/_events')
}
