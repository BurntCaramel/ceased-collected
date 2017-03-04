import { patchJSON } from './init'

export function updateContentForItem({ resources = 'stories', id, contentJSON }) {
  return patchJSON(`/@organizations/1/items/${resources}/${id}`, {
		contentJSON
	})
}