import React from 'react'
import * as types from '../constants/itemTypes'

function renderOwnerType(type) {
	switch (type) {
	case types.journey: return 'Journey'
	case types.collection: return 'Collection'
	case types.organization: return 'Organization'
	default: return type
	}
}

export default function OwnerNav({ owner, sectionTitle }) {
	const { type, id } = owner
	return (
		<nav className="primary">
      <h2>
				{ renderOwnerType(type) } { id }
				{ sectionTitle && <span> · { sectionTitle }</span> }
			</h2>
			{ `#${type}` }
		</nav>
	)
}
