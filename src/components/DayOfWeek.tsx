import type { Component } from 'solid-js'

const days_of_week = ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

export const DayOfWeek: Component<{ day: number }> = (props) => (
  <span class='day-of-week'>{days_of_week[props.day]}</span>
)
