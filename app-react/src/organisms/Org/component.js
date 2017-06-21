import React from 'react'
import Repo from '../../components/GitHub/Repo'

export default ({
	id,
	gitHubOrg,
	gitHubRepos,
	loadError,
	handlers: actions
}) => (
	<div>
	{
		!!gitHubOrg ? (
			<dl>
				<dt><img src={ gitHubOrg.avatar_url } width={ 100 } /></dt>
				<dt>Public repos</dt>
				<dd>{ gitHubOrg.public_repos }</dd>
				<dd>
					{ gitHubRepos.map(repo => <Repo key={ repo.id } { ...repo } />) }
				</dd>
				<dt>Home page</dt>
				<dd><a href={ gitHubOrg.blog }>{ gitHubOrg.blog }</a></dd>
			</dl>
		) : (
			loadError ? <p>{ loadError.message }</p> : 'Loading…'
		)
	}
	</div>
)