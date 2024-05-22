/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from 'react'
import FlipMove from 'react-flip-move';
import {
  Box,
  Button,
  ButtonProps,
  Collapse,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'

const ANIMATION_TIME = 250

type User = {
  name: string
  gender?: 'M' | 'F'
  icon?: string
}

const emojis = {
  M: ['🙍‍♂️', '🙎‍♂️', '🙅‍♂️', '🙆‍♂️', '💁‍♂️', '🙋‍♂️', '🧏‍♂️', '🙇‍♂️', '🤦‍♂️', '🤷‍♂️', '👨‍⚕️', '👨‍🎓', '👨‍🏫', '👨‍⚖️', '👨‍🌾', '👨‍🍳', '👨‍🔧', '👨‍🏭', '👨‍💼', '👨‍🔬', '👨‍💻', '👨‍🎤', '👨‍🎨', '👨‍✈️', '👨‍🚀', '👨‍🚒', '👮‍♂️', '🕵️‍♂️', '💂‍♂️', '👷‍♂️', '🤴', '🤵‍♂️', '👰‍♂️', '🤶', '🦸‍♂️', '🦹‍♂️', '🧙‍♂️', '🧚‍♂️', '🧛‍♂️', '🧜‍♂️', '🧝‍♂️', '🧞‍♂️', '🧟‍♂️',],
  F: ['🙍‍♀️', '🙎‍♀️', '🙅‍♀️', '🙆‍♀️', '💁‍♀️', '🙋‍♀️', '🧏‍♀️', '🙇‍♀️', '🤦‍♀️', '🤷‍♀️', '👩‍⚕️', '👩‍🎓', '👩‍🏫', '👩‍⚖️', '👩‍🌾', '👩‍🍳', '👩‍🔧', '👩‍🏭', '👩‍💼', '👩‍🔬', '👩‍💻', '👩‍🎤', '👩‍🎨', '👩‍✈️', '👩‍🚀', '👩‍🚒', '👮‍♀️', '🕵️‍♀️', '💂‍♀️', '👷‍♀️', '👸', '🤵‍♀️', '👰‍♀️', '🧑‍🎄', '🦸‍♀️', '🦹‍♀️', '🧙‍♀️', '🧚‍♀️', '🧛‍♀️', '🧜‍♀️', '🧝‍♀️', '🧞‍♀️', '🧟‍♀️',]
}

const userList: User[] = [
  { gender: 'M', name: 'Mario' },
  { gender: 'M', name: 'Kevin' },
  { gender: 'M', name: 'Josh Nicks' },
  { gender: 'M', name: 'Karim' },
  { gender: 'F', name: 'Sharon' },
  { gender: 'F', name: 'Alison' },
  { gender: 'F', name: 'Abika' },
  { gender: 'M', name: 'Josh Moon' },
  { gender: 'F', name: 'Jess' },
  { gender: 'F', name: 'Olivia' },
  { gender: 'M', name: 'Devin' },
  { gender: 'M', name: 'Mitch' },
  // { gender: 'M', name: 'Kurk' },
  // { gender: 'F', name: 'Sarah' },
]

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(-1)
  const [nextUserIndex, setNextUserIndex] = useState<number>(-1)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [nextUser, setNextUser] = useState<User | null>(null)
  const [nextUsersList, setNextUsersList] = useState<User[]>([])
  const [updating, setUpdating] = useState<boolean>(false)
  const [isRandomized, setIsRandomized] = useState<boolean>(false)
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [addingUsers, setAddingUsers] = useState<boolean>(false)
  const [newUsersText, setNewUsersText] = useState<string>('')

  const getUsersWithEmojis = (users: User[]): User[] => {
    const getRandomEmoji = (gender?: 'M' | 'F'): string => {
      let emoji = ''
      if (!gender) {
        const randomGender = Math.random() > 0.5 ? 'M' : 'F'
        emoji = emojis[randomGender][Math.floor(Math.random() * emojis[randomGender].length)];
      } else {
        emoji = emojis[gender][Math.floor(Math.random() * emojis[gender].length)];
      }
      return emoji
    }
    return users.map((user: User) => ({
      name: user.name,
      gender: user.gender,
      icon: getRandomEmoji(user.gender)
    }))
  }

  const getNewUsersList = (users: string): User[] => {
    return users.split(',').map((user: string) => {
      const [name, gender] = user.split(':')
      const sanitizedGender = gender?.trim().toUpperCase()
      return {
        name: name?.trim(),
        gender: ['F', 'M'].includes(sanitizedGender) ? sanitizedGender as 'F' | 'M' : null
      } as User
    })
  }

  const getListFromUsers = (users: User[]): string => {
    const usersText = users.map((user: User) => {
      const gender = user.gender ? `:${user.gender}` : ''
      return `${user.name}${gender}`
    })
    return usersText.join(',')
  }

  useEffect(() => {
    setUsers(getRandomSort([...getUsersWithEmojis(userList)]))
  }, [])

  useEffect(() => {
    setCurrentUser(getUserByIndex(currentUserIndex))
    setNextUser(getUserByIndex(nextUserIndex))
  }, [currentUserIndex, nextUserIndex])

  useEffect(() => {
    setNextUsersList(getNextUsersList())
  }, [currentUserIndex, users])

  const getRandomSort = (list: User[]): User[] => {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const randomize = (): void => {
    const newUsersOrder = getRandomSort(users)
    setUsers(newUsersOrder)
    setIsRandomized(true)
    setIsStarted(false)
    setIsDone(false)
    setCurrentUserIndex(-1)
    setNextUserIndex(-1)
  }

  const start = () => {
    if (users.length === 0) {
      return
    }
    setCurrentUserIndex(0)
    setNextUserIndex(1)
    setIsStarted(true)
    setIsDone(false)
  }

  const next = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
    }, ANIMATION_TIME)
    const newCurrentUserIndex = currentUserIndex + 1
    const newNextUserIndex = nextUserIndex + 1
    const isValidCurrentUserIndex = (
      currentUserIndex !== -1 &&
      newCurrentUserIndex >= 0 &&
      newCurrentUserIndex < users.length
    )
    const isValidNextUserIndex = (
      nextUserIndex !== -1 &&
      newNextUserIndex >= 0 &&
      newNextUserIndex < users.length
    )
    if (isStarted && !isValidCurrentUserIndex && !isValidNextUserIndex) {
      setIsDone(true)
    }
    setTimeout(() => {
      if (isValidCurrentUserIndex) {
        setCurrentUserIndex(newCurrentUserIndex)
      } else {
        setCurrentUserIndex(-1)
      }
      if (isValidNextUserIndex) {
        setNextUserIndex(newNextUserIndex)
      } else {
        setNextUserIndex(-1)
      }
    }, ANIMATION_TIME / 2)
  }

  const addUsersHandler = () => {
    if (!addingUsers) {
      setAddingUsers(true)
      setNewUsersText(getListFromUsers(users))
    } else {
      setUsers(getRandomSort([...getUsersWithEmojis(getNewUsersList(newUsersText))]))
      setAddingUsers(false)
    }
  }

  const getUserByIndex = (index: number): User | null => {
    if (index < 0 || index >= users.length) {
      return null
    }
    return users[index]
  }

  const getUserKey = (user: User): string => {
    return user.name.replace(/\s/g, '-').toLowerCase()
  }

  const getNextUsersList = () => {
    if (isStarted) {
      return [...users].splice(currentUserIndex + 2)
    } else {
      return [...users]
    }
  }

  const CustomListItem = forwardRef<HTMLLIElement, React.ComponentProps<typeof ListItem>>((props, ref) => (
    <ListItem ref={ref} {...props} />
  ))

  const CustomButton = (props: ButtonProps): JSX.Element => (
    <Button variant='contained' fullWidth {...props} />
  )

  if (isDone) {
    return (
      <Typography paddingTop={5} variant="h3">Done!</Typography>
    )
  }

  return (
    <Box display="flex" flexDirection="column" width="360px" rowGap={1}>

      {/* Current user */}
      <Collapse appear in={currentUserIndex !== -1}>
        <Box display="flex" flexDirection="column">
          <Typography variant="subtitle1">Current turn:</Typography>
          <Fade appear in={!updating} timeout={ANIMATION_TIME / 2}>
            <Box display="flex" flexDirection="row" justifyContent="center" gap={2} py={1}>
              <Typography variant='h4'> {currentUser?.icon || '👤'} </Typography>
              <Typography variant='h4'> {currentUser?.name || '...'} </Typography>
            </Box>
          </Fade>
        </Box>
      </Collapse>

      {/* Next user */}
      <Collapse appear in={nextUserIndex !== -1}>
        <Box display="flex" flexDirection="column">
          <Typography variant="subtitle1">Next turn:</Typography>
          <Fade appear in={!updating} timeout={ANIMATION_TIME / 2}>
            <Box display="flex" flexDirection="row" justifyContent="center" gap={2} py={1}>
              <Typography variant='h5'> {nextUser?.icon || '👤'} </Typography>
              <Typography variant='h5'> {nextUser?.name || '...'} </Typography>
            </Box>
          </Fade>
        </Box>
      </Collapse>

      <Collapse in={!isRandomized}>
        <CustomButton onClick={randomize}>Randomize!</CustomButton>
      </Collapse>

      <Collapse in={isRandomized}>
        <Box display="flex" flexDirection="row" >
          {isStarted ? (
            <Box display="flex" flexDirection="row" width="100%">
              <CustomButton onClick={next}>{nextUser ? 'Next' : 'Finish'}</CustomButton>
            </Box>
          ) : (
            <Box display="flex" flexDirection="row" width="100%">
              <CustomButton onClick={start}>Start</CustomButton>
            </Box>
          )}
        </Box>
      </Collapse>

      <List>
        <FlipMove>
          {nextUsersList.map((user: User) => (
            <CustomListItem key={getUserKey(user)} disablePadding>
              <ListItemIcon>
                {user.icon}
              </ListItemIcon>
              <ListItemText primary={user.name} />
            </CustomListItem>
          ))}
        </FlipMove>
      </List>

      <Collapse in={isRandomized && !isStarted}>
        <CustomButton onClick={randomize}>Randomize again!</CustomButton>
      </Collapse>

      <Collapse in={!isRandomized}>
        <CustomButton onClick={addUsersHandler}>
          {addingUsers ? 'Set them!' : 'Set new users'}
        </CustomButton>
      </Collapse>

      <Collapse in={addingUsers}>
        <TextField
          value={newUsersText}
          multiline
          rows={4}
          onChange={(e) => { setNewUsersText(e.target.value) }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "whitesmoke",
                borderWidth: "2px",
              },
            },
          }}></TextField>
      </Collapse>

    </Box>
  )
}

export default App
