import React from 'react'
import StoryEditor from '../components/StoryEditor'

export default function PreviewStory({ hmac }) {
	return (
		<section>
			<StoryEditor
				hmac={ hmac }
				previewOnly
			/>
		</section>
	)
}
