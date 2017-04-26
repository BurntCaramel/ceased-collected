import React from 'react'
import Field from './Field'
import Button from './Button'

export default class TapToEdit extends React.PureComponent {
	state = {
		editing: false,
		editedValue: null
	}

	commit(value) {
		this.setState({ editing: false })
		this.props.onCommitValue(value)
	}

	discard() {
		this.setState({
			editing: false,
			editedValue: null
		})
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
			this.commit(value)
		}
		else if (keyCode === 27) { // Escape
			this.discard()
		}
	}

	onBlur = ({ target: { value } }) => {
		this.commit(value)
	}

	render() {
		const { value, Normal, Editor } = this.props
		const { editing, editedValue } = this.state

		return (
			editing ? (
				<Editor value={ editedValue } onChange={ this.onChange } onKeyDown={ this.onKeyDown } onBlur={ this.onBlur } />
			) : (
				<Normal value={ value } onEdit={ this.onEdit } />
			)
		)
	}
}
