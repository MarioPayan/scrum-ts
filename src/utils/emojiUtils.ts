import { Participant } from '../types/Participant'

export const emojis = {
  M: ['🙍‍♂️', '🙎‍♂️', '🙅‍♂️', '🙆‍♂️', '💁‍♂️', '🙋‍♂️', '🧏‍♂️', '🙇‍♂️', '🤦‍♂️', '🤷‍♂️', '👨‍⚕️', '👨‍🎓', '👨‍🏫', '👨‍⚖️', '👨‍🌾', '👨‍🍳', '👨‍🔧', '👨‍🏭', '👨‍💼', '👨‍🔬', '👨‍💻', '👨‍🎤', '👨‍🎨', '👨‍✈️', '👨‍🚀', '👨‍🚒', '👮‍♂️', '🕵️‍♂️', '💂‍♂️', '👷‍♂️', '🤴', '🤵‍♂️', '👰‍♂️', '🤶', '🦸‍♂️', '🦹‍♂️', '🧙‍♂️', '🧚‍♂️', '🧛‍♂️', '🧜‍♂️', '🧝‍♂️', '🧞‍♂️', '🧟‍♂️'],
  F: ['🙍‍♀️', '🙎‍♀️', '🙅‍♀️', '🙆‍♀️', '💁‍♀️', '🙋‍♀️', '🧏‍♀️', '🙇‍♀️', '🤦‍♀️', '🤷‍♀️', '👩‍⚕️', '👩‍🎓', '👩‍🏫', '👩‍⚖️', '👩‍🌾', '👩‍🍳', '👩‍🔧', '👩‍🏭', '👩‍💼', '👩‍🔬', '👩‍💻', '👩‍🎤', '👩‍🎨', '👩‍✈️', '👩‍🚀', '👩‍🚒', '👮‍♀️', '🕵️‍♀️', '💂‍♀️', '👷‍♀️', '👸', '🤵‍♀️', '👰‍♀️', '🧑‍🎄', '🦸‍♀️', '🦹‍♀️', '🧙‍♀️', '🧚‍♀️', '🧛‍♀️', '🧜‍♀️', '🧝‍♀️', '🧞‍♀️', '🧟‍♀️']
}

export const getRandomEmoji = (gender?: 'M' | 'F'): string => {
  if (!gender) {
    const randomGender = Math.random() > 0.5 ? 'M' : 'F'
    return emojis[randomGender][Math.floor(Math.random() * emojis[randomGender].length)]
  }
  return emojis[gender][Math.floor(Math.random() * emojis[gender].length)]
}

export const assignEmojisToParticipants = (participants: Participant[]): Participant[] => {
  return participants.map((participant: Participant) => ({
    ...participant,
    icon: participant.icon || getRandomEmoji(participant.gender)
  }))
}
