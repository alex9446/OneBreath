import { Show, type ParentComponent } from 'solid-js'

const ErrorBox: ParentComponent = (props) => {
  return (
    <Show when={typeof props.children === 'string'}>
      <p style='color:red'>{props.children}</p>
    </Show>
  )
}

export default ErrorBox
