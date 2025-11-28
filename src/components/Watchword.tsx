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
    <div class='watchword' classList={{invalid: !props.valid()}}>
      <input type='text' name='watchword' required placeholder={'parola d\'ordine'}
             autocomplete='off' ref={watchwordElement}
             onKeyUp={() => checkWatchword(watchwordElement.value)} />
      <p>parola {props.valid() ? 'valida' : 'non valida'}</p>
    </div>
  )
}

export default Watchword
