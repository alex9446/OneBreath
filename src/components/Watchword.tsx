import type { Accessor, Component, Setter } from 'solid-js'
import { watchwordIsValid } from '../utils/mixed'

type WatchwordProps = {
  valid: Accessor<boolean>
  setValid: Setter<boolean>
}

const Watchword: Component<WatchwordProps> = (props) => {
  const checkWatchword = (word: string) => {
    watchwordIsValid(word).then((valid) => {
      if (valid !== props.valid()) props.setValid(valid)
    })
  }
  let watchwordElement!: HTMLInputElement

  return (
    <>
      <label for='watchword'>Parola d'ordine:</label>
      <input type='password' name='watchword' required ref={watchwordElement}
             onKeyUp={() => checkWatchword(watchwordElement.value)} />
      <p>{props.valid() ? 'valida' : 'non valida'}</p>
    </>
  )
}

export default Watchword
