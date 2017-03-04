import React from 'react'
import Gateau from 'gateau/lib/Main'
import createStateManager from 'gateau/lib/createStateManager'
import * as storiesAPI from '../api/stories'

function createStateManagerWithProps({ initialJSON }) {
	const manager = createStateManager()
	if (initialJSON) {
		manager.json = initialJSON
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
		this.props.onSaveStory(this.gateauStateManager.json, this.props.id)
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
		const { title, hmac, previewOnly = false, saving = false, onSaveStory } = this.props
		const { loaded, error } = this.state

		return (
			<div>
				{
					loaded ? (
						error ? (
							<p>{ error.message }</p>
						) : (
							<section>
								{ onSaveStory &&
									<button onClick={ this.onSave }>
										{ saving ? 'Saving…' : 'Save story' }
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
