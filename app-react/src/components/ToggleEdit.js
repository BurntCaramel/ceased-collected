import React from 'react'
import Field from './Field'
import Button from './Button'

export default class TapToEdit extends React.PureComponent {
	state = {
		editing: false,
		editedValue: null
	}

	onEdit = () => {
		this.setState({
			editing: true,
			editedValue: this.props.value
		})
	}

	onChange = ({ target: { value } }) => {
		this.setState({ editedValue: value })
	}

	onKeyDown = ({ keyCode, target: { value } }) => {
		if (keyCode === 13) { // Enter
			this.setState({ editing: false })
			this.props.onCommitValue(value)
		}
		else if (keyCode === 27) { // Escape
			this.setState({
				editing: false,
				editedValue: null
			})
		}
	}

	render() {
		const { value, Normal, Editor } = this.props
		const { editing, editedValue } = this.state

		return (
			editing ? (
				<Editor value={ editedValue } onChange={ this.onChange } onKeyDown={ this.onKeyDown } />
			) : (
				<Normal value={ value } onEdit={ this.onEdit } />
			)
		)
	}
}
