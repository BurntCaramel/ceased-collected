import { fetchJSON, postJSON } from './init'


// export function list() {
//   return fetchJSON('/stories')
// }
export function list() {
  return fetchJSON('/1/@organizations/1/items/stories')
}

export function readWithID(id) {
  return fetchJSON(`/1/@organizations/1/items/stories/${id}`)
}

// Remove
export function readWithHMAC(hmac) {
  return fetchJSON(`/1/stories/256/${hmac}`)
}

// Remove
export function create({ contentJSON }) {
  return postJSON(`/1/stories`, contentJSON)
}

export function readInOrganization({ uuid, organizationID, authToken }) {
  return fetchJSON(`/1/@${organizationID}/stories/${uuid}`)
}

export function createInOrganization({ storyJSON, organizationID, authToken }) {
  return postJSON(`/1/@${organizationID}/stories`, storyJSON, {
    headers: Object.assign({},
      authToken && {
        'Authorization': `Bearer ${authToken}`
      }
    )
  })
}
