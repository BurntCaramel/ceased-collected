import React from 'react'
import StoryEditor from '../components/StoryEditor'

export default function EditStory({ hmac, onSaveStory }) {
	return (
		<section>
			{ hmac == null &&
				<h1>Create an #lofi story</h1>
			}
			<StoryEditor
				hmac={ hmac }
				onSaveStory={ onSaveStory }
			/>
		</section>
	)
}
