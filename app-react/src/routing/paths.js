export function subpathToListOfType(type) {
	switch (type) {
		case 'journey':
			return '/journies'
		case 'collection':
			return `/collections`
		case 'story':
			return `/stories`
		case 'record':
			return '/records'
		default:
			throw new Error(`subpathToListOfType(): Unknown type: ${type}`)
	}
}

export function pathToBase({ type, id }) {
	switch (type) {
		case 'organization':
			return `/@${id}`
		default:
			return subpathToListOfType(type) + `/${id}`
	}
}

export function pathTo([ first, ...rest ]) {
	return pathToBase(first) + rest.map(item => (
		subpathToListOfType(item.type) + (item.id ? `/${item.id}` : '')
	)).join('/')
}
