import React from 'react'
import Repo from '../../components/GitHub/Repo'
import Row from '../../components/Row'

const alignCenterStyles = {
	textAlign: 'center'
}

export default ({
	id,
	gitHubOrg,
	gitHubRepos,
	reactComponentFilesByRepo,
	loadError,
	handlers: actions
}) => (
	<div>
	{
		!!gitHubOrg ? (
			<dl>
				<dt style={ alignCenterStyles }>
					<img src={ gitHubOrg.avatar_url } width={ 100 } height='auto' />
				</dt>
				<dt style={ alignCenterStyles }>Public repos</dt>
				<dd style={ alignCenterStyles }>{ gitHubOrg.public_repos }</dd>
				<dd>
					{ gitHubRepos.map(repo => <Repo key={ repo.id } { ...repo } reactComponentFiles={ reactComponentFilesByRepo[repo.full_name] } />) }
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