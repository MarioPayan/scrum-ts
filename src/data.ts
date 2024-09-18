export type User = {
  name: string
  gender?: 'M' | 'F'
  icon?: string
}

export const emojis = {
  M: ['🙍‍♂️', '🙎‍♂️', '🙅‍♂️', '🙆‍♂️', '💁‍♂️', '🙋‍♂️', '🧏‍♂️', '🙇‍♂️', '🤦‍♂️', '🤷‍♂️', '👨‍⚕️', '👨‍🎓', '👨‍🏫', '👨‍⚖️', '👨‍🌾', '👨‍🍳', '👨‍🔧', '👨‍🏭', '👨‍💼', '👨‍🔬', '👨‍💻', '👨‍🎤', '👨‍🎨', '👨‍✈️', '👨‍🚀', '👨‍🚒', '👮‍♂️', '🕵️‍♂️', '💂‍♂️', '👷‍♂️', '🤴', '🤵‍♂️', '👰‍♂️', '🤶', '🦸‍♂️', '🦹‍♂️', '🧙‍♂️', '🧚‍♂️', '🧛‍♂️', '🧜‍♂️', '🧝‍♂️', '🧞‍♂️', '🧟‍♂️',],
  F: ['🙍‍♀️', '🙎‍♀️', '🙅‍♀️', '🙆‍♀️', '💁‍♀️', '🙋‍♀️', '🧏‍♀️', '🙇‍♀️', '🤦‍♀️', '🤷‍♀️', '👩‍⚕️', '👩‍🎓', '👩‍🏫', '👩‍⚖️', '👩‍🌾', '👩‍🍳', '👩‍🔧', '👩‍🏭', '👩‍💼', '👩‍🔬', '👩‍💻', '👩‍🎤', '👩‍🎨', '👩‍✈️', '👩‍🚀', '👩‍🚒', '👮‍♀️', '🕵️‍♀️', '💂‍♀️', '👷‍♀️', '👸', '🤵‍♀️', '👰‍♀️', '🧑‍🎄', '🦸‍♀️', '🦹‍♀️', '🧙‍♀️', '🧚‍♀️', '🧛‍♀️', '🧜‍♀️', '🧝‍♀️', '🧞‍♀️', '🧟‍♀️',]
}

export const userList: User[] = [
  // T1
  { name: 'Abika', gender: 'F' },
  // T2
  { name: 'Mario', gender: 'M' },
  { name: 'Josh Nicks', gender: 'M' },
  { name: 'Karim', gender: 'M' },
  { name: 'Kevin', gender: 'M' },
  { name: 'Mitch', gender: 'M' },
  // T3
  { name: 'Olivia', gender: 'F' },
  { name: 'Devin', gender: 'M' },
  // T4
  { name: 'Jess Star', gender: 'F' },
  // T5
  { name: 'Alison', gender: 'F' },
  { name: 'Sharon', gender: 'F' },
  // T6
  { name: 'Josh Moon', gender: 'M' },
  { name: 'Jess Ribbens', gender: 'F' },
  // T7
  { name: 'Kurk', gender: 'M' },
  { name: 'Sarah', gender: 'F' },
]
