import type { Component, ParentProps } from 'solid-js'
import { A } from '@solidjs/router'
import './FakeButton.sass'

const FakeButton: Component<{ href: string } & ParentProps> = (props) => (
  <A class='fake-button' href={props.href}>{props.children}</A>
)

export default FakeButton
