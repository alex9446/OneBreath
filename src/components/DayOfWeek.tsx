import type { Component } from 'solid-js'

const daysOfWeek = ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

const DayOfWeek: Component<{ day: number }> = (props) => (
  <span class='day-of-week'>{daysOfWeek[props.day]}</span>
)

export default DayOfWeek
