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
		const { children, style } = this.props
		return (
			<a href={ this.path } style={ style } onClick={ this.onClick }>{ children }</a>
		)
	}
}
