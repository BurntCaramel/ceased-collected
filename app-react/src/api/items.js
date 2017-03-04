import { fetchJSON, patchJSON } from './init'

export function listWithType({ type }) {
  return fetchJSON(`/@organization/1/items/type:${type}`)
}

export function updateContentForItem({ type, id, contentJSON }) {
  return patchJSON(`/@organization/1/items/type:${type}/${id}`, {
		contentJSON
	})
}