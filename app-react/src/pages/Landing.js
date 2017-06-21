import React from 'react'
import Row from '../components/Row'
import Button from '../components/Button'
import NewsletterSignUp from '../components/NewsletterSignUp'
import ScreenExample from '../organisms/ScreenExample'
import GitHubIcon from 'react-icons/lib/fa/github'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import RightArrowIcon from 'react-icons/lib/fa/arrow-right'
import DownArrowIcon from 'react-icons/lib/fa/arrow-down'

export default function LandingPage({ onSaveStory }) {
	return (
		<div>
			<header>
				<h1>{ 'Get design, development, and marketing on the same page' }</h1>
				<h2>{ 'An open source system to plan your product as a team across content, architecture, and user journeys' }</h2>
			</header>
			<nav className='secondary sticky'>
				<Row alignItems='center' justifyContent='center'>
					<Button title='Get started for free' to='/go' primary large />
					<span style={{ display: 'inline-block', width: '0.666rem' }} />
					<a children={ <GitHubIcon size={ 44 } /> } href='https://github.com/RoyalIcing/Collected' />
					<span style={{ display: 'inline-block', width: '0.666rem' }} />
					<a children={ <TwitterIcon size={ 44 } /> } href='https://twitter.com/CollectedTool' />
				</Row>
			</nav>
			<section>
				<p style={{ textAlign: 'center' }}>
					Start with words to design components & journeys
					<br /><DownArrowIcon /><br />
					Prototype, receive feedback, iterate
					<br /><DownArrowIcon /><br />
					Refine into high fidelity designs and code
				</p>

				{ false && <p><strong>Start with what your user cares about:</strong> your message of how you’ll solve their problem. What will your landing page say to them? What will the first email they receive from you encourage? How easily can they get signed up and start solving those problems of theirs?</p> }
				<p>Collected speaks the various pieces of your app fluently. Work with <strong>copy, UI components, images, content models, records</strong> and combine them into prototype <strong>screens, emails, ads, and entire journeys.</strong></p>
				<p>Organise them into catalogs that you share with your whole team.</p>
				<p><strong>Test your flows from any situation.</strong> Sign in as a particular user persona. Start at someone’s first day, fast forward two weeks, and then six months. Switch entirely to another language.</p>
				<p>Integrate with visual design tools. <strong>Add high fidelity components you’ve created in Sketch.</strong> Quickly turn those into prototypes just by writing.</p>
				
				<h2>An open source system built for modern product teams</h2>

				<ul>
					<li>Simple system based on modern workflow: component-first and content-first</li>
					<li>Becomes live documentation for both designers and developers</li>
					<li>Communicate back-and-forth how a design is to be implemented</li>
					<li>Make high level changes and quickly get everyone on the same page</li>
					<li>Rewind to any point in time, and compare to what you have now</li>
				</ul>

				<ScreenExample>
					Click me #button
					{'\n'}
					Primary button #button #primary
				</ScreenExample>
				
				<div style={{ height: '0.5rem' }} />
				<NewsletterSignUp />
			</section>
		</div>
	)
}
