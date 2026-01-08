import { Participant } from '../types/Participant'

const STORAGE_KEY = 'scrum-participants'

export class ParticipantService {
  static getAll(): Participant[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return []
    }
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing participants from localStorage:', error)
      return []
    }
  }

  static getActive(): Participant[] {
    return this.getAll().filter(p => p.active)
  }

  static save(participants: Participant[]): void {
    const sorted = [...participants].sort((a, b) => 
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  }

  static add(participant: Omit<Participant, 'id'>): Participant {
    const participants = this.getAll()
    const newParticipant: Participant = {
      ...participant,
      id: crypto.randomUUID()
    }
    participants.push(newParticipant)
    this.save(participants)
    return newParticipant
  }

  static update(id: string, updates: Partial<Omit<Participant, 'id'>>): boolean {
    const participants = this.getAll()
    const index = participants.findIndex(p => p.id === id)
    if (index === -1) {
      return false
    }
    participants[index] = { ...participants[index], ...updates }
    this.save(participants)
    return true
  }

  static remove(id: string): boolean {
    const participants = this.getAll()
    const filtered = participants.filter(p => p.id !== id)
    if (filtered.length === participants.length) {
      return false
    }
    this.save(filtered)
    return true
  }

  static toggleActive(id: string): boolean {
    const participants = this.getAll()
    const participant = participants.find(p => p.id === id)
    if (!participant) {
      return false
    }
    return this.update(id, { active: !participant.active })
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}
