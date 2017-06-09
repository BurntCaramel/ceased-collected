import React from 'react'
import seeds from 'react-seeds'
import * as colors from './colors'
import Link from './Link'

const styles = ({ primary, tab, large, small }) => ({
	display: 'inline-block',
	flexGrow: tab ? 1 : null,
	fontSize: large ? '1.5rem' : small ? '0.875rem' : '1rem',
	lineHeight: '1.3em',
	color: colors.action[primary ? 'highlight' : 'normal'],
	textDecoration: 'none',
	paddingTop: '0.1em', paddingBottom: '0.1em', paddingLeft: '0.5em', paddingRight: '0.5em',
	backgroundColor: colors.action[primary ? 'normal' : 'highlight'],
	borderWidth: tab ? 0 : 1, borderStyle: 'solid', borderColor: colors.action.normal,
	borderRadius: tab ? 0 : 5,
	cursor: 'pointer'
})

export default function Button({ title, primary = false, tab = false, large = false, small = false, classes, to, onClick }) {
	const Component = !!to ? Link : 'button'
	return (
		<Component
			children={ title }
			to={ to }
			onClick={ onClick }
			style={ styles({ primary, tab, large, small, classes }) }
		/>
	)
}
