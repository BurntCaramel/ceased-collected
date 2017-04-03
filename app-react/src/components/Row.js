import React from 'react'
import seeds from 'react-seeds'

const styler = ({ wrap, alignItems, justifyContent, marginBottom }) => seeds({
	row: true,
	wrap,
	alignItems,
	justifyContent,
	maxWidth: '38rem',
	margin: { left: 'auto', right: 'auto', bottom: marginBottom }
})

export default function Row({ children, wrap, alignItems, justifyContent, marginBottom }) {
		return (
				<div
						children={ children }
						{ ...styler({ wrap, alignItems, justifyContent, marginBottom }) }
				/>
		)
}
