import React from 'react'
import Gateau from 'gateau/lib/Main'
import createStateManager from 'gateau/lib/createStateManager'
import * as storiesAPI from '../api/stories'

function createStateManagerWithProps({ initialJSON, initialPreviewDestination }) {
	const manager = createStateManager()
	if (initialJSON) {
		manager.json = initialJSON
	}
	if (initialPreviewDestination) {
		manager.destinationDevice = initialPreviewDestination.device
		manager.destinationID = initialPreviewDestination.framework
	}
	return manager
}

export const initial = (props) => ({
	loaded: props.hmac == null || props.json != null, // Only loaded if new story
	error: null,
	gateauStateManager: createStateManagerWithProps(props)
})

export const save = ({ id, name, gateauStateManager, onSaveStory }) => {
	onSaveStory({
		contentJSON: gateauStateManager.json,
		name,
		previewDestination: {
			device: gateauStateManager.destinationDevice,
			framework: gateauStateManager.destinationID
		}
	}, id)
}

export const destroy = ({ id, onDelete }) => {
	onDelete(id)
}

export const changeName = ({ id, onEditName }, { target }) => {
	onEditName(target.value, id)
}

export const load = ({ hmac, gateauStateManager }, prevProps) => {
	if (!prevProps && !!hmac) {
		return storiesAPI.readWithHMAC(hmac)
		.then(story => {
			gateauStateManager.json = story
			return { loaded: true }
		})
		.catch(error => {
			if (error.response && error.response.status === 404) {
				error = new Error('The specified story does not exist.')
			}

			return { error }
		})
	}
}
