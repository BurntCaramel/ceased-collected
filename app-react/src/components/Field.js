import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds from 'react-seeds'
import Label from './Label'
import * as colors from './colors'
import * as visualStylers from './visualStylers'

const defaultFont = { size: '1rem' }

const stylers = {
	input: ({
		hasTitle,
		grow,
		rows,
		width,
		font = defaultFont,
		transparent = false
	}) => ({
		style: {
			...seeds({
				grow,
				width,
				margin: { left: hasTitle ? '0.5em' : null },
				font,
				text: { lineHeight: '1.3rem', color: colors.action.normal },
				padding: { base: rows > 1 ? '0.25em' : '0.125em', left: '0.25em', right: 0 },
				cornerRadius: 2
			}).style,
			...(transparent ? visualStylers.transparent.style : visualStylers.field.style)
		}
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
	safeSizeToFit() {
		const el = this.el
		if (!!el) { // null when unmounting
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
		const { value, title, grow, width, font, rows = 1, transparent, onChange, onKeyDown } = this.props
		const Component = rows === 1 ? 'input' : 'textarea'
		const hasTitle = (title != null)
		const input = (
			<Component
				ref={ this.setElement }
				value={ value }
				onChange={ onChange }
				onKeyDown={ onKeyDown }
				{ ...(rows === 1 ? null : { rows }) }
				{ ...stylers.input({
					hasTitle,
					grow,
					rows,
					width,
					font,
					transparent
				}) }
			/>
		)

		return (
			<Label title={ title } children={ input } />
		)
	}
}
