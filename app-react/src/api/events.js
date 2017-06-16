import { fetchJSON, postJSON } from './index'


export function list() {
  return fetchJSON('/_events')
}
