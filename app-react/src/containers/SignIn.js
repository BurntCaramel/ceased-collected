import React from 'react'
import Auth0LockPasswordless from 'auth0-lock-passwordless'
import Row from '../components/Row'
import Button from '../components/Button'
import { setAuthToken } from '../api'

const lock = new Auth0LockPasswordless(process.env.REACT_APP_AUTH0_CLIENT_ID, process.env.REACT_APP_AUTH0_DOMAIN)

function checkSignedInState() {
	// Use hash passed by Auth0
	const hash = lock.parseHash(window.location.hash)

	if (hash) {
		// Hide hash from URL
		window.location.hash = ''
		
		if (hash.id_token) {
			// Signed in successfully
			setAuthToken(hash.id_token)
		}
		else if (hash.error) {
			return {
				error: hash.error,
				errorDescription: hash.error_description
			}
		}
	}
	
	return {}
}

export default class SignIn extends React.PureComponent {
	state = checkSignedInState()

	onSignIn = () => {
		//const query = (new URL(document.location)).searchParams
		lock.magiclink({
			responseType: 'token',
			callbackURL: location.protocol + '//' + location.host + '/signin',
			//callbackURL: location.protocol + '//' + location.host + '/auth0/callback/cookie',
			authParams:
				{ scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
				//, state: query.get('state')
			}
		});
	}

	render() {
		const { error, errorDescription } = this.state

		return (
			<div>
				<header>
					<h1>{ 'Design from content to polish' }</h1>
				</header>
				<section>
					{ error && (
						<Row>
							<p>Error signing in: { error } { errorDescription }</p>
						</Row>
					) }
					<Row justifyContent='center'>
						<Button
							title='Join / Sign In'
							primary
							large
							onClick={ this.onSignIn }
						/>
					</Row>
				</section>
			</div>
		)
	}
}
