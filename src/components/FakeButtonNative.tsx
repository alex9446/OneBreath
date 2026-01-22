import type { Component, ParentProps } from 'solid-js'
import './FakeButton.sass'

type FakeButtonNativeProps = { href: string, newPage?: boolean } & ParentProps

const FakeButtonNative: Component<FakeButtonNativeProps> = (props) => (
  <a class='fake-button' href={props.href} target={props.newPage ? '_blank' : undefined}>
    {props.children}
  </a>
)

export default FakeButtonNative
