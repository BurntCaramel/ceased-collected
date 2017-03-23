import React from 'react'
import seeds from 'react-seeds'

const styler = seeds({
	row: true
})

export default function Row({ children }) {
		return (
				<div
						children={ children }
						{ ...styler }
				/>
		)
}
