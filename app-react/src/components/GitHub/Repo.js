import React from 'react'
import Row from '../Row'
import Column from '../Column'
import ReactComponentFilesList from './ReactComponentFilesList'

export default ({
	id,
	name,
	description,
	url,
	homepage,
	language,
	default_branch: defaulBranch,
	languages_url: languagesURL,
	reactComponentFiles
}) => (
	<article>
		<Row details>
			<Row summary>
				<p>{ name } · <small>{ language }</small></p>
			</Row>
			<p>{ description } &nbsp; <a href={ homepage }>{ homepage }</a></p>
			<dl>
				<dt>React Components</dt>
				<dd>
				{ reactComponentFiles && reactComponentFiles.length > 0 &&
					<ReactComponentFilesList items={ reactComponentFiles } />
				}
				</dd>
			</dl>
		</Row>
	</article>
)