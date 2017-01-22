import React from 'react'

export default function Story({ id, title, body, ingredients = [] }) {
	return (
		<article>
      <h2>{ title } / { id }</h2>
			<pre>{ JSON.stringify(body, null, 2) }</pre>
		</article>
	)
}
