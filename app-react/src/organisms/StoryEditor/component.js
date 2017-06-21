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

export default class StoryEditor extends React.Component {
	gateauStateManager = createStateManagerWithProps(this.props)

	render() {
		const {
			loaded, error,
			name, previewOnly = false, saving = false,
			onSaveStory, onDelete, onEditName,
			handlers
		} = this.props

		return (
			<div>
				{
					loaded ? (
						error ? (
							<p>{ error.message }</p>
						) : (
							<section>
								{ onEditName &&
									<input value={ name } onChange={ handlers.changeName } />
								}
								{ onSaveStory &&
									<button onClick={ handlers.save }>
										{ saving ? 'Saving…' : 'Save iteration' }
									</button>
								}
								{ onDelete &&
									<button onClick={ handlers.destroy }>
										{ 'Delete' }
									</button>
								}
								<Gateau
									stateManager={ this.gateauStateManager }
									previewOnly={ previewOnly }
									backgroundColor='transparent'
								/>
							</section>
						)
					) : (
						'Loading story…'
					)
				}
			</div>
		)
	}
}
