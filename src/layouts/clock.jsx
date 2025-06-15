// RealTimeClock.jsx
import React, { useState, useEffect } from 'react'

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export default function RealTimeClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  
  const offsetMin = -now.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const offsetH = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(1, '0')
  const tz = `UTC${sign}${offsetH}`

  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' })
  const day = now.getDate()
  const month = now.toLocaleDateString(undefined, { month: 'long' })
  const year = now.getFullYear()
  const dayWithOrd = `${day}${getOrdinal(day)}`

  return (
    <div>
      <div>
        {hours}:{minutes} <span>{tz}</span>
      </div>
      <div>
        {weekday}, {dayWithOrd} {month}, {year}
      </div>
    </div>
  )
}
