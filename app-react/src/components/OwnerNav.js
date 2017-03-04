import React from 'react'

function renderOwnerType(type) {
	switch (type) {
	case 'collection': return 'Collection'
	case 'organization': return 'Organization'
	default: return type
	}
}

export default function OwnerNav({ owner }) {
	const { type, id } = owner
	return (
		<nav>
      <h2>{ renderOwnerType(type) } { id }</h2>
		</nav>
	)
}
