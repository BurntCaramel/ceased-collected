import React from 'react'
import { findDOMNode } from 'react-dom'
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
		flexGrow: grow,
		width,
		marginLeft: hasTitle ? '0.5em' : null,
		fontSize: font.size,
		lineHeight: '1.3rem', color: colors.action.normal,
		paddingTop: rows > 1 ? '0.25em' : '0.125em',
		paddingBottom: rows > 1 ? '0.25em' : '0.125em',
		paddingLeft: '0.25em',
		paddingRight: 0,
		borderRadius: 2,
		...(transparent ? visualStylers.transparent.style : visualStylers.field.style)
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
				style={ stylers.input({
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
