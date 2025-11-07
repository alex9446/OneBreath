import type { Component } from 'solid-js'

const daysOfWeek = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

export const DayOfWeek: Component<{ day: number }> = (props) => (
  <span class='day-of-week'>{daysOfWeek[props.day]}</span>
)

export const DaysOfWeek: Component<{ days: number[] }> = (props) => (
  <span class='days-of-week'>{props.days.map((day) => daysOfWeek[day]).join(', ')}</span>
)
