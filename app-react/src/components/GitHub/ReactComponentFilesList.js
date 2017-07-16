import React from 'react'
import makeOrganism from 'react-organism'

const File = makeOrganism(({
	path,
	git_url: gitURL,
	html_url: htmlURL,
	content,
	handlers: {
		loadContent
	}
}) => (
	<div>
		<a href={ gitURL } onClick={ loadContent }>{ path }</a>
		{ content &&
			<pre><code>{ content }</code></pre>
		}
	</div>
), {
	initial: () => ({
		content: null
	}),
	loadContent: async ({ git_url: gitURL }, event) => {
		event.preventDefault()

		const fileInfo = await fetch(gitURL).then(res => res.json())
		const content = atob(fileInfo.content) // FIXME: use better base64 library
		return { content }
	}
})

export default function ReactComponentFilesList({
	items
}) {
	return (
		<div>
		{
			items.map(item => (
				<File key={ item.git_url } { ...item } />
			))
		}
		</div>
	)
}