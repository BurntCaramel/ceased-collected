import React from 'react'

export default ({
	id,
	name,
	description,
	url,
	homepage,
	language,
	default_branch,
	languages_url: languagesURL
}) => (
	<article>
		<h2>{ name } · <small>{ language }</small></h2>
		<p>{ description } &nbsp; <a href={ homepage }>{ homepage }</a></p>
	</article>
)