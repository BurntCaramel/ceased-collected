import React from 'react'
import seeds from 'react-seeds'
import * as colors from './colors'

const styles = ({ primary, tab, large, small }) => seeds({
	grow: tab ? 1 : null,
	font: { size: large ? '1.5rem' : small ? '0.875rem' : '1rem' },
	text: { lineHeight: '1.3em', color: colors.action[primary ? 'highlight' : 'normal'] },
	padding: { base: '0.1em', left: '0.5em', right: '0.5em' },
	background: { color: colors.action[primary ? 'normal' : 'highlight'] },
	border: { width: tab ? 0 : 1, style: 'solid', color: colors.action.normal },
	cornerRadius: tab ? 0 : 5,
	cursor: 'pointer'
})

export default function Button({ title, primary = false, tab = false, large = false, small = false, classes, onClick }) {
	return (
		<button
			children={ title }
			onClick={ onClick }
			{ ...styles({ primary, tab, large, small, classes }) }
		/>
	)
}
