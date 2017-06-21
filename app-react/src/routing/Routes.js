import React from 'react'
import { observer } from 'mobx-react'
import location from 'mobx-location'
import * as types from '../constants/itemTypes'
import { createStoriesObservable } from '../managers/stories'
import { createJourneysObservable } from '../managers/journeys'
import { createCollectionsObservable } from '../managers/collections'
import LandingPage from '../pages/Landing'
import Go from '../organisms/Go'
import Org from '../organisms/Org'
import Stories from '../organisms/Stories'
import Journeys, { Journey } from '../organisms/Journeys'
import Collections from '../organisms/Collections'
import EditStory from '../organisms/EditStory'
import PreviewStory from '../organisms/PreviewStory'
import OwnerNav from '../components/OwnerNav'

const ownerRoutes = {
	_: ({ owner, collectionsManager }, []) => (
		<div>
			<OwnerNav owner={ owner } />
			{
				owner.type === types.organization ? (
					<Org
						id={ owner.id }
					/>
				) : owner.type === types.collection ? (
					<Collections
						collectionsManager={ collectionsManager }
						itemID={ owner.id }
					/>
				) : null
			}
		</div>
	),
	'stories': ({ owner, storiesManager }, [ id ]) => (
		<div>
			<OwnerNav owner={ owner } sectionTitle='Stories' />
			<Stories
				storiesManager={ storiesManager }
				owner={ owner }
				id={ id }
			/>
		</div>
	),
	'journeys': ({ owner, journeysManager }, [ itemID ]) => (
		<Journeys
			journeysManager={ journeysManager }
			owner={ owner }
			itemID={ itemID }
		/>
	),
	'collections': ({ owner, collectionsManager }, [ itemID ]) => (
		<Collections
			collectionsManager={ collectionsManager }
			owner={ owner }
			itemID={ itemID }
		/>
	)
}

const routes = {
	'go': () => <Go />,
	_: [
		{
			assign: 'isCollection',
			method: (pathComponent) => pathComponent === 'collections',
			routes: [
				{
					assign: ['owner', 'collectionsManager', 'storiesManager'],
					method: (id) => {
						const owner = { type: 'collection', id }
						return {
							owner,
							collectionsManager: createCollectionsObservable({ owner: null }),
							storiesManager: createStoriesObservable({ owner })
						}
					},
					routes: ownerRoutes
				}
			]
		},
		{
			assign: ['owner', 'collectionsManager', 'journeysManager', 'storiesManager'],
			method: (pathComponent) => {
				if (pathComponent[0] === '@') {
					const id = pathComponent.substring(1)
					const owner = { type: 'organization', id }
					return {
						owner,
						storiesManager: createStoriesObservable({ owner }),
						journeysManager: createJourneysObservable({ owner }),
						collectionsManager: createCollectionsObservable({ owner })
					}
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
								if (Array.isArray(childRoute.assign)) {
									childRoute.assign.forEach(key => {
										propsCopy[key] = extraction[key]
									})
								}
								else {
									propsCopy[childRoute.assign] = extraction
								}
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

		if (!usedComponent && pathComponent != '') {
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
