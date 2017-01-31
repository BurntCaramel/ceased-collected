import React from 'react'

export default function Event({ section, type, timestamp }) {
	return (
		<article>
      <h2>{ section } / { type }</h2>
			<pre>{ timestamp }</pre>
		</article>
	)
}
