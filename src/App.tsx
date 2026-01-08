/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move';
import {
  Box,
  Button,
  Collapse,
  Fade,
  Typography
} from '@mui/material'
import ConfettiExplosion from 'react-confetti-explosion';
import getRandomGifUrl, { getDefaultGifUrl } from './giphyClient';
import { Participant } from './types/Participant';
import { ParticipantService } from './services/ParticipantService';
import { assignEmojisToParticipants } from './utils/emojiUtils';
import { ParticipantManager } from './components/ParticipantManager';

const ANIMATION_TIME = 250

function App() {
  const [users, setUsers] = useState<Participant[]>([])
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(-1)
  const [nextUserIndex, setNextUserIndex] = useState<number>(-1)
  const [currentUser, setCurrentUser] = useState<Participant | null>(null)
  const [nextUser, setNextUser] = useState<Participant | null>(null)
  const [nextUsersList, setNextUsersList] = useState<Participant[]>([])
  const [updating, setUpdating] = useState<boolean>(false)
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isScrumStarted, setIsScrumStarted] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [gifUrl, setGifUrl] = useState<string>('')
  const [confetti, setConfetti] = useState<boolean>(true)
  const [giphyRateLimitExceeded, setGiphyRateLimitExceeded] = useState<boolean>(false)

  const loadParticipants = () => {
    const activeParticipants = ParticipantService.getActive()
    setUsers(activeParticipants)
  }

  useEffect(() => {
    loadParticipants()
    getRandomGifUrl().then((url) => {
      if (url) {
        setGifUrl(url)
        setGiphyRateLimitExceeded(false)
      } else {
        setGifUrl(getDefaultGifUrl())
        setGiphyRateLimitExceeded(true)
      }
    })
  }, [])

  useEffect(() => {
    setCurrentUser(getUserByIndex(currentUserIndex))
    setNextUser(getUserByIndex(nextUserIndex))
  }, [currentUserIndex, nextUserIndex])

  useEffect(() => {
    setNextUsersList(getNextUsersList())
  }, [currentUserIndex, users])

  useEffect(() => {
    setConfetti(true)
  }, [isDone])

  const getRandomSort = (list: Participant[]): Participant[] => {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const randomize = (): void => {
    const activeParticipants = ParticipantService.getActive()
    const participantsWithEmojis = assignEmojisToParticipants(activeParticipants)
    const newUsersOrder = getRandomSort(participantsWithEmojis)
    setUsers(newUsersOrder)
    setIsStarted(false)
    setIsScrumStarted(true)
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

  const startScrum = () => {
    randomize()
    // Start automatically after a brief moment to show the randomized order
    setTimeout(() => {
      start()
    }, 500)
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

  const handleParticipantsUpdate = () => {
    loadParticipants()
    setIsStarted(false)
    setIsScrumStarted(false)
    setIsDone(false)
    setCurrentUserIndex(-1)
    setNextUserIndex(-1)
  }

  const getUserByIndex = (index: number): Participant | null => {
    if (index < 0 || index >= users.length) {
      return null
    }
    return users[index]
  }

  const getUserKey = (user: Participant): string => {
    return user.name.replace(/\s/g, '-').toLowerCase()
  }

  const getNextUsersList = () => {
    if (isStarted) {
      return [...users].splice(currentUserIndex + 2)
    } else {
      return [...users]
    }
  }

  if (isDone) {
    return (
      <Box display="flex" gap={4} paddingTop={5} flexDirection="column" justifyContent="center" position="relative">
        <Typography variant="h3" sx={{ textAlign: "center" }}>Done!</Typography>
        {giphyRateLimitExceeded && (
          <>
            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              Giphy API rate limit exceeded ¯\_(ツ)_/¯
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              Enjoy the confetti!
            </Typography></>
        )}
        {gifUrl && (
          <Box display="flex" justifyContent="center">
            <img src={gifUrl} alt="Gif" style={{ maxWidth: "360px" }} />
          </Box>
        )}
        {confetti &&
          <ConfettiExplosion
            particleCount={175}
            style={{ position: "absolute", top: "50%", left: "50%" }}
            onComplete={() => setConfetti(false)} />}
      </Box>
    )
  }

  // Initial confirmation screen - before scrum starts
  if (!isScrumStarted) {
    return (
      <Fade in timeout={600}>
        <Box 
          display="flex" 
          flexDirection="column" 
          width="400px" 
          rowGap={3}
          sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: "center",
              fontWeight: 300,
              letterSpacing: '-0.5px',
              mb: 1,
              fontSize: '1.75rem'
            }}
          >
            Daily Scrum
          </Typography>
          
          {users.length === 0 ? (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center" 
              py={4}
              sx={{ opacity: 0.6, fontSize: '0.9rem' }}
            >
              No participants yet
            </Typography>
          ) : (
            <Box sx={{ my: 1 }}>
              {users.map((user: Participant) => (
                <Box
                  key={getUserKey(user)} 
                  sx={{
                    py: 1.5,
                    px: 2,
                    mb: 0.5,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      letterSpacing: '0.3px'
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box display="flex" flexDirection="column" gap={1.5} mt={1}>
            <Button
              onClick={startScrum}
              disabled={users.length === 0}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Start
            </Button>
            
            <ParticipantManager onUpdate={handleParticipantsUpdate} />
          </Box>
        </Box>
      </Fade>
    )
  }

  // Scrum order screen - after scrum starts
  return (
    <Fade in timeout={800}>
      <Box 
        display="flex" 
        flexDirection="column" 
        width="400px" 
        rowGap={2}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >

      {/* Current user */}
      <Collapse appear in={currentUserIndex !== -1}>
        <Box display="flex" flexDirection="column" mb={2}>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.5, 
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontSize: '0.7rem',
              fontWeight: 500
            }}
          >
            Now speaking
          </Typography>
          <Fade appear in={!updating} timeout={ANIMATION_TIME / 2}>
            <Box 
              display="flex" 
              flexDirection="row" 
              alignItems="center"
              gap={2} 
              py={2.5}
              px={2.5}
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.3)'
              }}
            >
              <Typography 
                variant='h5' 
                sx={{ 
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  fontSize: '1.5rem'
                }}
              >
                {currentUser?.icon}
              </Typography>
              <Typography 
                variant='h5' 
                sx={{ 
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  fontSize: '1.5rem'
                }}
              >
                {currentUser?.name || '...'}
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Collapse>

      {/* Next user */}
      <Collapse appear in={nextUserIndex !== -1}>
        <Box display="flex" flexDirection="column" mb={2}>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.5, 
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontSize: '0.7rem',
              fontWeight: 500
            }}
          >
            Up next
          </Typography>
          <Fade appear in={!updating} timeout={ANIMATION_TIME / 2}>
            <Box 
              display="flex" 
              flexDirection="row" 
              alignItems="center"
              gap={2} 
              py={2}
              px={2.5}
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <Typography sx={{ fontSize: '1.25rem' }}>
                {nextUser?.icon}
              </Typography>
              <Typography 
                variant='body1' 
                sx={{ 
                  fontWeight: 400,
                  fontSize: '1.1rem',
                  letterSpacing: '0.3px'
                }}
              >
                {nextUser?.name || '...'}
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Collapse>

      {/* Next button */}
      <Button
        onClick={next}
        fullWidth
        sx={{
          py: 1.5,
          mb: 2,
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
          }
        }}
      >
        {nextUser ? 'Next' : 'Finish'}
      </Button>

      {/* Remaining users list */}
      {nextUsersList.length > 0 && (
        <Box>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.5, 
              mb: 1.5,
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontSize: '0.7rem',
              fontWeight: 500
            }}
          >
            Remaining ({nextUsersList.length})
          </Typography>
          <Box>
            <FlipMove>
              {nextUsersList.map((user: Participant) => (
                <Box
                  key={getUserKey(user)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.25,
                    px: 2,
                    mb: 0.5,
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.04)'
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '1rem' }}>
                    {user.icon}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '0.9rem',
                      fontWeight: 400,
                      opacity: 0.8,
                      letterSpacing: '0.2px'
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              ))}
            </FlipMove>
          </Box>
        </Box>
      )}

    </Box>
    </Fade>
  )
}

export default App
