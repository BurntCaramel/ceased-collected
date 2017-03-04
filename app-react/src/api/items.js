import api, { fetchJSON, postJSON, patchJSON } from './init'

export function listWithType({ owner, type }) {
  return fetchJSON(`/@${owner.type}/${owner.id}/items/type:${type}`)
}

export function createItem({ owner, type, contentJSON, name }) {
  return postJSON(`/@${owner.type}/${owner.id}/items/type:${type}`, {
		contentJSON,
		name
	})
}

export function updateItem({ owner, type, id, contentJSON, name, previewDestination }) {
  return patchJSON(`/@${owner.type}/${owner.id}/items/type:${type}/${id}`, {
		contentJSON,
		name,
		previewDestination
	})
}

export function deleteItem({ owner, type, id }) {
  return api.delete(`/@${owner.type}/${owner.id}/items/type:${type}/${id}`)
}