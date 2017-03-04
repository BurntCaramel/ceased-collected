import React from 'react'
import { observer } from 'mobx-react'
import location from 'mobx-location'
import LandingPage from './LandingPage'
import Stories from './Stories'
import EditStory from './EditStory'
import PreviewStory from './PreviewStory'

const routes = {
	root: () => (
		<LandingPage />
	),
	'stories': {
		root: () => (
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
	const pathComponents = location.pathname.split('/').slice(1)
	const { routes: renderer, rest } = pathComponents.reduce(({ routes, rest }, pathComponent) => {
		if (routes.call) {
			return { routes, rest: rest.concat(pathComponent) }
		}
		else if (routes[pathComponent]) {
			return { routes: routes[pathComponent], rest }
		}
		else {
			return { routes, rest: rest.concat(pathComponent) }
		}
	}, { routes, rest: [] })

	console.log('renderer', renderer, location.pathname)

	if (renderer.call) {
		return renderer(props, rest)
	}
	else if (renderer.root) {
		return renderer.root(props, rest)
	}
	else {
		return <noscript />
	}
}

export default observer(Routes)
