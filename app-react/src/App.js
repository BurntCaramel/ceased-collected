import React, { Component } from 'react'
import Gateau from 'gateau/lib/Main'
import { addHandlers } from 'react-ramda'
import * as storiesAPI from './api/stories'
import StoryList from './components/StoryList'
import './App.css'

class App extends Component {
	constructor(props) {
		super(props)

		addHandlers(this)

		this.pendingPromises = {}
		this.renderPromise = (stateProp) => {
			const renderedKey = stateProp+'Element'

			if (!this.pendingPromises[stateProp]) {
				this.pendingPromises[stateProp] = this.renderingPromises[stateProp](this.props, this.state)
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

	state = {
		listExpanded: false,
		stories: null,
		storiesElement: null
	}

	renderingPromises = {
		stories: () => storiesAPI.list()
			.then(stories => {
				console.log('stories', stories)
        return <StoryList stories={ stories } />
			})
			.catch(error => (
				`Error loading stories: ${ error.message }`
			))
	}

	render() {
		const {
			listExpanded
		} = this.state

		return (
			<div className="App">
				<div className="App-header">
					<h1>Create an action story</h1>
				</div>
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
			</div>
		);
	}
}

export default App
