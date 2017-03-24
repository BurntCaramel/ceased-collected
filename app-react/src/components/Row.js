import React from 'react'
import seeds from 'react-seeds'

const styler = ({ wrap, justifyContent, marginBottom }) => seeds({
	row: true,
	wrap,
	justifyContent,
	maxWidth: '38rem',
	margin: { left: 'auto', right: 'auto', bottom: marginBottom }
})

export default function Row({ children, wrap, justifyContent, marginBottom }) {
		return (
				<div
						children={ children }
						{ ...styler({ wrap, justifyContent, marginBottom }) }
				/>
		)
}
