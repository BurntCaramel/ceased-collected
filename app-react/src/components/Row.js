import React from 'react'
import seeds from 'react-seeds'

const styler = ({ marginBottom }) => seeds({
	row: true,
	maxWidth: '38rem',
	margin: { left: 'auto', right: 'auto', bottom: marginBottom }
})

export default function Row({ children, marginBottom }) {
		return (
				<div
						children={ children }
						{ ...styler({ marginBottom }) }
				/>
		)
}
