import React from 'react'
import Event from './Event'

const EventList = ({ events }) => (
  <div>
  {
    events.map(event =>
      <Event key={ event.timestamp } { ...event } />
    )
  }
  </div>
)

export default EventList
