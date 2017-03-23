import React from 'react'
import seeds from 'react-seeds'

const style = seeds({
	row: true,
	alignItems: 'baseline',
	justifyContent: 'center',
	text: { lineHeight: '1.3rem' }
})

export default function Label({ title, children }) {
	return (
		(title != null) ? (
			<label { ...style }>
				<span>{ title }</span>
				&nbsp;
				{ children }
			</label>
		) : (
			children
		)
	)
}