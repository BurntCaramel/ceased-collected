import React from 'react'
import goTo from './goTo'

export default class Redirect extends React.Component {
	componentWillMount() {
		goTo(this.props.to)
	}

	render() {
		return null
	}
}