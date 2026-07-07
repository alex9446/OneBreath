import type { Component, ParentProps, Setter } from 'solid-js'
import './Checkbox.sass'

type CheckboxProps = {
  name?: string
  checked: boolean | undefined
  set?: Setter<boolean>
} & ParentProps

const Checkbox: Component<CheckboxProps> = (props) => (
  <label class='checkbox'>
    <input type='checkbox' name={props.name} checked={props.checked}
           onInput={(e) => props.set && props.set(e.currentTarget.checked)} />
    {props.children}
  </label>
)

export default Checkbox
