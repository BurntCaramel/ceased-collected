import React from 'react'
import Link from './Link'

export default function APIErrorMessage({ error }) {
	if (error.response) {
		const { status } = error.response
		if (status === 401) {
			return <div>
				<p>You are not authorized: <Link to='/signin'>sign in</Link> or request access; or the item may not exist</p>
			</div>
		}
		else if (status === 404) {
			return <p>The item does not exist</p>
		}
		else if (status === 500) {
			return <p>The server experienced an internal error</p>
		}
		else if (status >= 502 && status <= 504) {
			return <p>The server is currently overloaded or down</p>
		}
	}

	return <p>{ error.message }</p>
}