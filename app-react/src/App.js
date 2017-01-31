import React, { Component } from 'react'
import { addHandlers } from 'react-ramda'
import { observer } from 'mobx-react'
import Cookie from 'cookie'
import decodeJWT from 'jwt-decode'
import * as storiesAPI from './api/stories'
import * as eventsAPI from './api/events'
import StoryEditor from './components/StoryEditor'
import EventList from './components/EventList'
import makeLoadable from './components/makeLoadable'
import router from './containers/router'
import './App.css'

const eventListRenderers = [
	events => <EventList events={ events } />,
	error => `Error loading events: ${ error.message }`,
	started => started ? 'Loading events…' : null
]

const Routes = observer(function Routes(props) {
	return router.render(props)
})

function readAuthToken() {
	const cookies = Cookie.parse(document.cookie)
	try {
		return decodeJWT(cookies['auth-token'])
	}
	catch (error) {
		return null
	}
}

class App extends Component {
	state = {
		authToken: readAuthToken(),
		listExpanded: false,
		storyHMAC: null
	}

	constructor(props) {
		super(props)

		this.disposers = []

		this.events = makeLoadable(eventsAPI.list)
		this.Events = this.events.makeComponent(...eventListRenderers)

		this.saveNewStory = makeLoadable(storiesAPI.create)
		this.disposers.push(this.saveNewStory.observe(({ result }) => {
			if (result) {
				const hmac = result.data.contentHMAC
				this.setState({ storyHMAC: hmac })
				window.history.pushState(null, 'New story', `/stories/256/${hmac}`)
			}
		}))

		addHandlers(this)

		this.pendingPromises = {}
		this.renderPromise = (stateProp, options = {}) => {
			const renderedKey = stateProp+'Element'

			if (!this.pendingPromises[stateProp]) {
				this.pendingPromises[stateProp] = this.renderingPromises[stateProp](this.state, this.props)
				this.pendingPromises[stateProp].then(
					element => {
						this.setState({ [renderedKey]: element })
					},
					error => {
						this.setState({ error })
					}
				)
			}

			return this.state[renderedKey]
		}
	}

	componentWillUnmount() {
		this.disposers.forEach(disposer => disposer())
	}

	renderingPromises = {
		events: () => eventsAPI.list()
			.then(events =>
				<EventList events={ events } />
			)
			.catch(error =>
				`Error loading events: ${ error.message }`
			),
	}

	componentDidMount() {
		this.events.start()
	}

	render() {
		const {
			listExpanded,
			storyHMAC
		} = this.state

		return (
			<main className="App">
				<Routes
					onSaveStory={ this.saveNewStory.start }
				/>
			</main>
		);
	}
}

/*
{
	<this.Events />
	//this.renderPromise('events') || 'Loading events'
}

{ listExpanded ? (
	<ul>
	{
		this.renderPromise('stories') || 'Loading stories'
	}
	</ul>
) : (
	<button
		onClick={ this.handleToggle('listExpanded') }
		children='Show stories'
	/>
) }
*/

export default App
