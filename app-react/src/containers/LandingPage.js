import React from 'react'
import StoryEditor from '../components/StoryEditor'

export default function LandingPage({ onSaveStory }) {
	return (
		<div>
			<header>
				<h1>Low fidelity prototyping allows high fidelity answers sooner</h1>
			</header>
			<section>
				<h2>Make UIs with just hashtags and share with anyone</h2>
				<ul>
					<li>Preview live as Bootstrap, Foundation, and vanilla web</li>
					<li>Create user interfaces in minutes</li>
					<li>No HTML/CSS skills needed</li>
					<li>Design by writing #hashtags and @mentions</li>
				</ul>
				<a href='/stories/new' className='primary'>
					<h2>Create your own story</h2>
				</a>
				<StoryEditor hmac='30fe67f8aad9529f22e48344700846add63887ce18a203bd189deeb76f60447c' />
			</section>
		</div>
	)
}