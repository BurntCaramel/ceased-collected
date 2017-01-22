import { fetchJSON, postJSON } from './init'


export function list() {
  return fetchJSON('/stories')
}

export function read(id) {
  return fetchJSON(`/stories/${id}`)
}

export function create(storyJSON) {
  return postJSON(`/stories`, storyJSON)
}

