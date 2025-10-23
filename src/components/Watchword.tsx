import type { Accessor, Component, Setter } from 'solid-js'
import { watchwordIsValid } from '../utils/mixed'
import './Watchword.sass'

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
      <label for='watchword'>
        Parola d'ordine: 
        <span id='watchword-hint' classList={{invalid: !props.valid()}}>
          {props.valid() ? 'valida' : 'non valida'}
        </span>
      </label>
      <input id='watchword' type='password' name='watchword' required
             ref={watchwordElement}
             onKeyUp={() => checkWatchword(watchwordElement.value)}
             classList={{invalid: !props.valid()}} />
    </>
  )
}

export default Watchword
