import { Show, type Component, type ParentProps } from 'solid-js'
import { A } from '@solidjs/router'
import './FakeButton.sass'

type FakeButtonProps = { href: string, color?: string } & ParentProps

const FakeButton: Component<FakeButtonProps> = (props) => (
  <Show when={props.color} fallback={<A class='fake-button' href={props.href}>{props.children}</A>}>
    <A class='fake-button' style={{ 'background-color': props.color }} href={props.href}>{props.children}</A>
  </Show>
)

export default FakeButton
