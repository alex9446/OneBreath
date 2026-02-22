import type { Component, ParentProps } from 'solid-js'
import './FakeButton.sass'

type FakeButtonNativeProps = {
  href?: string
  newPage?: boolean
  disabled?: boolean
} & ParentProps

const FakeButtonNative: Component<FakeButtonNativeProps> = (props) => (
  <a class='fake-button' classList={{ disabled: props.disabled }}
     href={props.href} target={props.newPage ? '_blank' : undefined}>
    {props.children}
  </a>
)

export default FakeButtonNative
