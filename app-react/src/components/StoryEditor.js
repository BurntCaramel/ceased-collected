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
	state = {
		loaded: this.props.hmac == null || this.props.json != null, // Only loaded if new story
		error: null
	}

	gateauStateManager = createStateManagerWithProps(this.props)

	onSave = (event) => {
		const stateManager = this.gateauStateManager
		this.props.onSaveStory({
			contentJSON: stateManager.json,
			name: this.props.name,
			previewDestination: {
				device: stateManager.destinationDevice,
				framework: stateManager.destinationID
			}
		}, this.props.id)
	}

	onDelete = (event) => {
		this.props.onDelete(this.props.id)
	}

	onChangeName = (event) => {
		this.props.onEditName(event.target.value, this.props.id)
	}

	componentDidMount() {
		const { hmac } = this.props
		if (hmac) {
			storiesAPI.readWithHMAC(hmac)
			.then(story => {
				this.gateauStateManager.json = story
				this.setState({ loaded: true })
			})
			.catch(error => {
				if (error.response && error.response.status === 404) {
					error = new Error('The specified story does not exist.')
				}

				this.setState({ error })
			})
		}
	}

	render() {
		const {
			name, previewOnly = false, saving = false,
			onSaveStory, onDelete, onEditName
		} = this.props
		const { loaded, error } = this.state

		return (
			<div>
				{
					loaded ? (
						error ? (
							<p>{ error.message }</p>
						) : (
							<section>
								{ onEditName &&
									<input value={ name } onChange={ this.onChangeName } />
								}
								{ onSaveStory &&
									<button onClick={ this.onSave }>
										{ saving ? 'Saving…' : 'Save iteration' }
									</button>
								}
								{ onDelete &&
									<button onClick={ this.onDelete }>
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
