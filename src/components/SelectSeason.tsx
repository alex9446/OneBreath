import { For, type Component, type Setter } from 'solid-js'
import { FIRST_SEASON } from '@shared/mixed.ts'
import { currentSeason, range } from '../utils/mixed'

type SelectSeasonProps = {
  value: number | undefined
  set?: Setter<number | undefined>
}

const SelectSeason: Component<SelectSeasonProps> = (props) => {
  const seasons = range(FIRST_SEASON, currentSeason() + 1)

  const onInput = (value: string) => props.set?.(value === 'all' ? undefined : parseInt(value))

  return (
    <select name='season' required value={props.value ?? 'all'}
            onInput={(e) => onInput(e.currentTarget.value)}>
      <option value='all'>Tutte le stagioni</option>
      <For each={seasons}>
        {(season) => <option value={season}>Stagione {season}/{season+1}</option>}
      </For>
    </select>
  )
}

export default SelectSeason
