import React from 'react'

const style = {
	display: 'flex', flexDirection: 'row',
	alignItems: 'baseline',
	justifyContent: 'center',
	lineHeight: '1.3rem'
}

export default function Label({ title, children }) {
	return (
		(title != null) ? (
			<label style={ style }>
				<span>{ title }</span>
				&nbsp;
				{ children }
			</label>
		) : (
			children
		)
	)
}