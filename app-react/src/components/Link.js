import React from 'react'
import goTo from '../routing/goTo'
import { pathTo } from '../routing/paths'

export default class Link extends React.PureComponent {
	get path() {
		let path = this.props.to
		if (Array.isArray(path)) {
			path = pathTo(path)
		}

		return path
	}

	onClick = (event) => {
		event.preventDefault()

		goTo(this.path)
	}

	render() {
		const { children } = this.props
		const { path } = this
		return (
			<a href={ path } onClick={ this.onClick }>{ children }</a>
		)
	}
}
