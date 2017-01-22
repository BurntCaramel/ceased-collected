import React from 'react'
import Story from './Story'

const Stories = ({ stories }) => (
  <div>
  {
    stories.map(story =>
      <Story key={ story.id } { ...story } />
    )
  }
  </div>
)

export default Stories
