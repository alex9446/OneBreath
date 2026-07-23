import { createContext, useContext, type Component, type ParentProps } from 'solid-js'

const userIdContext = createContext<string>()

export const UserIdProvider: Component<{ userId: string } & ParentProps> = (props) => (
  <userIdContext.Provider value={props.userId}>{props.children}</userIdContext.Provider>
)

export const useUserId = () => {
  const context = useContext(userIdContext)
  if (!context) throw new Error('can\'t find userIdContext')
  return context
}
