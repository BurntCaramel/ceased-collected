import React from 'react'
import Link from './Link'
import { pathTo } from '../routing/paths'

const renderStyle = ({ primary }) => ({
	marginBottom: primary ? 0 : 16
})

export default function Item({ owner, type, id, name, children, primary = false }) {
	const Heading = primary ? 'h1' : 'h2'
	return (
		<article style={ renderStyle({ primary }) }>
			<Heading>
				<Link to={ pathTo(owner ? [owner, { type, id }] : [{ type, id }]) }>
					{ name }
				</Link>
			</Heading>
			{ children }
		</article>
	)
}
