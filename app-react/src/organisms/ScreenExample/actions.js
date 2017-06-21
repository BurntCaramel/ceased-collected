import React from 'react'

export const initial = ({
	children = ''
}) => ({
	modes: [{id: 'edit', title: 'Edit'}, {id: 'preview', title: 'Preview'}],
	currentMode: 'edit',
	content: React.Children.toArray(children).join('')
})

export const changeContent = (props, { target }) => ({ content: target.value })

export const changeMode = (props, newMode) => ({ currentMode: newMode })
