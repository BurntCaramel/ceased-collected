import React from 'react'
import StoryEditor from '../components/StoryEditor'
import NewsletterSignUp from '../components/NewsletterSignUp'

export default function LandingPage({ onSaveStory }) {
	return (
		<div>
			<header>
				<h1>{ 'Get feedback sooner with rapid prototyping' }</h1>
			</header>
			<section>
				<h2>{ 'Create low fidelity screens, emails, and promotions and share with users & stakeholders' }</h2>
				<ul>
					<li>Prototype with just words and #hashtags</li>
					<li>Make and iterate user interfaces in minutes</li>
					<li>Preview screens as live Bootstrap, Foundation, and vanilla web</li>
					<li>No HTML/CSS skills needed</li>
				</ul>
				<a href='/stories/new' className='primary'>
					<h2>Create your own story</h2>
				</a>
				<StoryEditor hmac='30fe67f8aad9529f22e48344700846add63887ce18a203bd189deeb76f60447c' />
				<StoryEditor hmac='d948775d99340265db8085f1b2e39da48331d390e079f1bc168075b5113b3b95' />
				<div style={{ height: '0.5rem' }} />
				<NewsletterSignUp />
			</section>
		</div>
	)
}
