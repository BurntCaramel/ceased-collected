import React from 'react'
import { observable } from 'mobx'
import location from 'mobx-location'
import LandingPage from './LandingPage'
import Stories from './Stories'
import EditStory from './EditStory'

const routes = {
	root: () => (
		<LandingPage />
	),
	stories: {
		root: () => (
			<Stories />
		),
		// '256': {
		// 	1: (hmac, { onSaveStory }) => (
		// 		<EditStory
		// 			hmac={ hmac }
		// 			onSaveStory={ onSaveStory }
		// 		/>
		// 	),
		// 	new: ({ onSaveStory }) => (
		// 		<EditStory
		// 		hmac={ hmac }
		// 		onSaveStory={ onSaveStory }
		// 	/>
		// 	)
		// }
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
		)
	}
}

// const routes = [
//   {
//     path: [],
//     render: () => 'landing page'
//   },
//   {
//     path: ['stories'],
//     render: () => 'stories'
//   },
//   {
//     path: ['stories', '256', (hmac) => ({ hmac })],
//     render: ({ hmac }) => 'edit story'
//   }
// ]

export default observable({
	location,
	render(props) {
		const pathComponents = this.location.pathname.split('/').slice(1)
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

		console.log('renderer', renderer, this.location.pathname)

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
})
