import { createSignal } from 'solid-js'
import { watchwordIsValid } from '../utils/mixed'

const Watchword = () => {
  const [watchwordValid, setWatchwordValid] = createSignal(false)
  const checkWatchword = (word: string) => {
    watchwordIsValid(word).then((valid) => {
      if (valid !== watchwordValid()) setWatchwordValid(valid)
    })
  }
  let watchwordElement!: HTMLInputElement

  return (
    <>
      <label for='watchword'>Parola d'ordine:</label>
      <input type='text' name='watchword' required ref={watchwordElement}
             onKeyUp={() => checkWatchword(watchwordElement.value)} />
      <p>{watchwordValid() ? 'valida' : 'non valida'}</p>
    </>
  )
}

export default Watchword
