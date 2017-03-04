import api, { fetchJSON, postJSON, patchJSON } from './init'

export function listWithType({ type }) {
  return fetchJSON(`/@organization/1/items/type:${type}`)
}

export function createItem({ type, contentJSON, name }) {
  return postJSON(`/@organization/1/items/type:${type}`, {
		contentJSON,
		name
	})
}

export function updateItem({ type, id, contentJSON, name, previewDestination }) {
  return patchJSON(`/@organization/1/items/type:${type}/${id}`, {
		contentJSON,
		name,
		previewDestination
	})
}

export function deleteItem({ type, id }) {
  return api.delete(`/@organization/1/items/type:${type}/${id}`)
}