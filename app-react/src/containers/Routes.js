import React from 'react'
import { observer } from 'mobx-react'
import location from 'mobx-location'
import LandingPage from './LandingPage'
import Stories from './Stories'
import EditStory from './EditStory'
import PreviewStory from './PreviewStory'
import OrganizationNav from '../components/OrganizationNav'

const routes = {
	_: [
		{
			assign: 'organizationID',
			method: (pathComponent) => pathComponent[0] === '@' ? pathComponent.substring(1) : null,
			routes: {
				_: ({ organizationID }) => (
					<OrganizationNav organizationID={ organizationID } />
				),
				'stories': {
					_: ({ organizationID }) => (
						<div>
							<OrganizationNav organizationID={ organizationID } />
							<Stories owner={{ type: 'organization', id: organizationID }} />
						</div>
					),
				}
			}
		},
		{
			routes: () => (
				<LandingPage />
			)
		}
	],
	'stories': {
		_: () => (
			<Stories />
		),
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

function Routes(props) {
	let propsCopy = Object.assign({}, props)

	const pathComponents = location.pathname.split('/').slice(1).concat('') // Split /, removing leading /
	let { routes: renderer, rest } = pathComponents.reduce(({ routes, rest }, pathComponent) => {
		let usedComponent = false

		console.log('pathComponent', pathComponent, routes)

		if (routes) {
			if (pathComponent != '' && routes[pathComponent]) {
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
		return <noscript />
	}
}

export default observer(Routes)
