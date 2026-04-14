import { Show, type Component } from 'solid-js'

type IconProps = {
  height?: number
  width?: number
  viewBox?: `${number} ${number}`
  classList?: { [k: string]: boolean }
  onClick?: () => void
  title?: string
  path: string
  color?: string
}

const Icon: Component<IconProps> = (props) => {
  const getSizeInPx = (size?: number) => `${size ?? 36}px`

  return (
    <svg height={getSizeInPx(props.height)} width={getSizeInPx(props.width)}
         viewBox={`0 0 ${props.viewBox ?? '24 24'}`} classList={props.classList}
         onClick={props.onClick}>
      <Show when={props.title}>
        <title>{props.title}</title>
      </Show>
      <path d={props.path} fill={props.color} />
    </svg>
  )
}

export default Icon
