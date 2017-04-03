import React from 'react'
import Row from './Row'
import * as types from '../constants/itemTypes'
import seeds from 'react-seeds'

function renderOwnerType(type) {
	switch (type) {
	case types.journey: return 'Journey'
	case types.collection: return 'Collection'
	case types.organization: return 'Organization'
	default: return type
	}
}

const stylers = {
	heading: seeds({
		grow: 1,
		lineHeight: 1.2
	})
}

export default function OwnerNav({ owner, name, sectionTitle }) {
	const { type, id } = owner
	return (
		<nav className='primary'>
			<Row alignItems='baseline'>
				<h2 { ...stylers.heading }>
					{
						name || <span>{ renderOwnerType(type) } { id }</span>
					}
					{ sectionTitle && <span> · { sectionTitle }</span> }
				</h2>
				{ `#${type}` }
			</Row>
		</nav>
	)
}
