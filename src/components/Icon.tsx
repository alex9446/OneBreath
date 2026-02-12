import { Show, type Component } from 'solid-js'

type IconProps = {
  size?: number
  title?: string
  classList?: { [k: string]: boolean }
  path: string
  color?: string
}

const Icon: Component<IconProps> = (props) => {
  const size = props.size ? `${props.size}px` : '36px'

  return (
    <svg height={size} width={size} viewBox='0 0 24 24' classList={props.classList}>
      <Show when={props.title}>
        <title>{props.title}</title>
      </Show>
      <path d={props.path} fill={props.color} />
    </svg>
  )
}

export default Icon
