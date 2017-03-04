import React from 'react'
import { observer } from 'mobx-react'
import location from 'mobx-location'
import { createStoriesObservable } from '../managers/stories'
import LandingPage from './LandingPage'
import Stories from './Stories'
import EditStory from './EditStory'
import PreviewStory from './PreviewStory'
import OwnerNav from '../components/OwnerNav'

const ownerRoutes = {
	_: ({ storiesManager }, []) => (
		<OwnerNav owner={ storiesManager.owner } />
	),
	'stories': ({ storiesManager }, []) => (
		<div>
			<OwnerNav owner={ storiesManager.owner } />
			<Stories storiesManager={ storiesManager } owner={ storiesManager.owner } />
		</div>
	)
}

const routes = {
	_: [
		{
			assign: 'isCollection',
			method: (pathComponent) => pathComponent === '@collection',
			routes: [
				{
					assign: 'storiesManager',
					method: (id) => createStoriesObservable({ owner: { type: 'collection', id } }),
					routes: ownerRoutes
				}
			]
		},
		{
			assign: 'storiesManager',
			method: (pathComponent) => {
				if (pathComponent[0] === '@') {
					const id = pathComponent.substring(1)
					return createStoriesObservable({ owner: { type: 'organization', id } })
				}
			},
			routes: ownerRoutes
		},
		{
			routes: () => (
				<LandingPage />
			)
		}
	],
	'stories': {
		'new': ({ onSaveStory }) => (
			<EditStory
				onSaveStory={ onSaveStory }
			/>
		),
		'256': ({ onSaveStory }, [ hmac ]) => (
			<EditStory
				hmac={ hmac }
				onSaveStory={ onSaveStory }
			/>
		),
		'preview': {
			'256': ({}, [ hmac ]) => (
				<PreviewStory
					hmac={ hmac }
				/>
			)
		}
	}
}

function NotFoundDefault({ path, renderer }) {
	return <p>Page not found: { path } { JSON.stringify(renderer) }</p>
}

function Routes(props, { NotFound = NotFoundDefault } = {}) {
	let propsCopy = Object.assign({}, props)

	const path = location.pathname
	const pathComponents = path.split('/').slice(1).concat('') // Split /, removing leading /
	let { routes: renderer, rest } = pathComponents.reduce(({ routes, rest }, pathComponent) => {
		let usedComponent = false

		console.log('pathComponent', pathComponent, routes)

		if (routes) {
			if (pathComponent != '' && routes[pathComponent]) {
				console.log('got route for', pathComponent)
				routes = routes[pathComponent]
				usedComponent = true
			}
			else {
				if (routes._) {
					routes = routes._
				}

				if (Array.isArray(routes)) {
					let newRoutes
					routes.some(childRoute => {
						const extraction = childRoute.method ? childRoute.method(pathComponent) : true
						console.log('route matches', extraction)
						if (extraction) {
							if (childRoute.assign) {
								propsCopy[childRoute.assign] = extraction
							}
							newRoutes = childRoute.routes
							usedComponent = true
							return true
						}
						return false
					})

					routes = newRoutes
				}
			}
		}

		if (!usedComponent) {
			rest = rest.concat(pathComponent)
		}

		return { routes, rest }
	}, { routes, rest: [] })

	console.log('renderer', renderer, location.pathname)

	if (!!renderer && renderer._) {
		renderer = renderer._
	}

	if (!!renderer && renderer.call) {
		return renderer(propsCopy, rest)
	}
	else {
		return <NotFound path={ path } renderer={ renderer } />
	}
}

export default observer(Routes)
