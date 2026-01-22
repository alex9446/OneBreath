import type { Component, ParentProps } from 'solid-js'
import { A } from '@solidjs/router'
import './FakeButton.sass'

type FakeButtonProps = { href: string, color?: string } & ParentProps

const FakeButton: Component<FakeButtonProps> = (props) => (
  <A class='fake-button' href={props.href}
     style={props.color ? { 'background-color': props.color } : {}}>
    {props.children}
  </A>
)

export default FakeButton
