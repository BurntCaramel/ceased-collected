import React from 'react'
import Button from '../components/Button'
import NewsletterSignUp from '../components/NewsletterSignUp'

export default function LandingPage({ onSaveStory }) {
	return (
		<div>
			<header>
				<h1>{ 'Get design, development, and marketing on the same page' }</h1>
				<h2>{ 'Plan your product as a team across messaging, architecture, and user journeys' }</h2>
				<Button title='Join free' to='/go' primary large />
			</header>
			<section>
				<p><strong>Start with what your user cares about:</strong> your message of how you’ll solve their problem. What will your landing page say to them? What will the first email they receive from you encourage? How easily can they get signed up and start solving those problems of theirs?</p>
				<p>Collected speaks the various pieces of your app fluently. Work with <strong>copy, UI components, images, content models, records, screens.</strong> Organise them into collections that you share with your whole team.</p>
				<p><strong>Test your flows from any situation.</strong> Sign in and sign out as any user persona. Start at someone’s first day, fast forward eight weeks, and then two years. Switch entirely to another language.</p>
				<p>Integrate with visual design tools. <strong>Add high fidelity components you’ve created in Sketch.</strong> Quickly turn those into prototypes just by writing.</p>
				
				<h2>An open source system built for modern product teams</h2>

				<ul>
					<li>Simple system based on modern workflow: components, content-first</li>
					<li>Becomes live documentation for both designers and developers</li>
					<li>Communicate back-and-forth how a design is to be implemented</li>
					<li>Make high level changes and quickly get everyone on the same page</li>
					<li>Rewind to any point in time, and compare to what you have now</li>
				</ul>
				
				<div style={{ height: '0.5rem' }} />
				<NewsletterSignUp />
			</section>
		</div>
	)
}
