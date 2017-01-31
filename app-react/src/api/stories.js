import { fetchJSON, postJSON } from './init'


export function list() {
  return fetchJSON('/stories')
}

export function readWithHMAC(hmac) {
  return fetchJSON(`/stories/256/${hmac}`)
}

export function create(storyJSON) {
  return postJSON(`/stories`, storyJSON)
}

export function readInOrganization({ uuid, organizationID, authToken }) {
  return fetchJSON(`/@${organizationID}/stories/${uuid}`)
}

export function createInOrganization({ storyJSON, organizationID, authToken }) {
  return postJSON(`/@${organizationID}/stories`, storyJSON, {
    headers: Object.assign({},
      authToken && {
        'Authorization': `Bearer ${authToken}`
      }
    )
  })
}