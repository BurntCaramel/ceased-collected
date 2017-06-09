import React from 'react'
import StoryEditor from '../components/StoryEditor'

export default function EditStory({ hmac, onSaveStory }) {
	return (
		<section>
			{ hmac == null &&
				<header>
					<h1>Create a #lofi story</h1>
				</header>
			}
			<StoryEditor
				hmac={ hmac }
				onSaveStory={ onSaveStory }
			/>
		</section>
	)
}
