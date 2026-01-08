export interface Participant {
  id: string
  name: string
  gender?: 'M' | 'F'
  icon?: string
  active: boolean
}
