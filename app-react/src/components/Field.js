import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds from 'react-seeds'
import Label from './Label'
import * as colors from './colors'

const stylers = {
	input: ({ hasTitle, grow, width }) => seeds({
		grow,
		width,
		margin: { left: hasTitle ? '0.5em' : null },
		font: { size: '1rem' },
		text: { lineHeight: '1.3rem', color: colors.action.normal },
		padding: { left: '0.25em' },
		background: { color: colors.lightness.normal },
		border: { color: colors.action.normal, width: 1, style: 'solid' },
		cornerRadius: 2
	})
}

function sizeTextAreaToFit(el) {
	const { style } = el
	style.height = '1px'

	const measuredHeight = `${ el.scrollHeight + el.offsetHeight - el.clientHeight }px` 
	style.height = measuredHeight
	style.resize = 'none'
}

export default class Field extends React.PureComponent {
	safeSizeToFit = () => {
		const el = this.el
		if (el != null) { // null when unmounting
			if (el.tagName.toLowerCase() === 'textarea') {
				sizeTextAreaToFit(el)
			}
		}
	}

	componentDidUpdate() {
		this.safeSizeToFit()
	}

	setElement = (component) => {
		this.el = findDOMNode(component)

		this.safeSizeToFit()
	}

	render() {
		const { value, title, grow, width, rows = 1, onChange } = this.props
		const Component = rows === 1 ? 'input' : 'textarea'
		const hasTitle = (title != null)
		const input = (
			<Component
				ref={ this.setElement }
				value={ value }
				onChange={ onChange }
				{ ...(rows === 1 ? null : { rows }) }
				{ ...stylers.input({
					hasTitle,
					grow,
					width
				}) }
			/>
		)

		return (
			<Label title={ title } children={ input } />
		)
	}
}
