import type { Component } from 'solid-js'

const daysOfWeek = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

export const DayOfWeek: Component<{ day: number }> = (props) => (
  <span style='font-weight: 500'>{daysOfWeek[props.day]}</span>
)

export const DaysOfWeek: Component<{ days: number[] }> = (props) => (
  <span style='font-weight: 500'>{props.days.map((day) => daysOfWeek[day]).join(', ')}</span>
)
