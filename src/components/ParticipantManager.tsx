import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { Participant } from '../types/Participant'
import { ParticipantService } from '../services/ParticipantService'

interface ParticipantManagerProps {
  onUpdate: () => void
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({ onUpdate }) => {
  const [open, setOpen] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState<'M' | 'F' | ''>('')

  const loadParticipants = () => {
    setParticipants(ParticipantService.getAll())
  }

  const handleOpen = () => {
    loadParticipants()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingParticipant(null)
    setNewName('')
    setNewGender('')
    onUpdate()
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    
    ParticipantService.add({
      name: newName.trim(),
      gender: newGender || undefined,
      active: true
    })
    setNewName('')
    setNewGender('')
    loadParticipants()
  }

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant)
    setNewName(participant.name)
    setNewGender(participant.gender || '')
  }

  const handleUpdate = () => {
    if (!editingParticipant || !newName.trim()) return
    
    ParticipantService.update(editingParticipant.id, {
      name: newName.trim(),
      gender: newGender || undefined
    })
    setEditingParticipant(null)
    setNewName('')
    setNewGender('')
    loadParticipants()
  }

  const handleCancelEdit = () => {
    setEditingParticipant(null)
    setNewName('')
    setNewGender('')
  }

  const handleDelete = (id: string) => {
    ParticipantService.remove(id)
    loadParticipants()
  }

  const handleToggleActive = (id: string) => {
    ParticipantService.toggleActive(id)
    loadParticipants()
  }

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={handleOpen}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 400,
          py: 1.5,
          color: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: 'rgba(255, 255, 255, 0.9)'
          }
        }}
      >
        Manage Participants
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            color: "white",
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 300,
          fontSize: '1.5rem',
          letterSpacing: '-0.5px',
          pb: 1,
         
        }}>
          Manage Participants
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={2}>
            {/* Add/Edit Form */}
            <Box display="flex" flexDirection="column" gap={2} p={2.5} bgcolor="rgba(255, 255, 255, 0.03)" borderRadius="16px" border="1px solid rgba(255, 255, 255, 0.05)">
              <Typography variant="caption" sx={{ 
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.7rem'
              }}>
                {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
              </Typography>
              <TextField
                label="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white'
                  }
                }}
              />
              <FormControl fullWidth size="small" sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white'
                }
              }}>
                <InputLabel>Gender (Optional)</InputLabel>
                <Select
                  value={newGender}
                  label="Gender (Optional)"
                  onChange={(e) => setNewGender(e.target.value as 'M' | 'F' | '')}
                  sx={{
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" gap={1}>
                {editingParticipant ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={!newName.trim()}
                      fullWidth
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                        }
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      fullWidth
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.03)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      }
                    }}
                  >
                    Add Participant
                  </Button>
                )}
              </Box>
            </Box>

            {/* Participants List */}
            <Box>
              <Typography variant="caption" mb={1.5} display="block" sx={{ 
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.7rem'
              }}>
                Participants ({participants.length})
              </Typography>
              {participants.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4} sx={{ opacity: 0.5 }}>
                  No participants yet
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={1}>
                  {participants.map((participant) => (
                    <Box
                      key={participant.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: participant.active ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                        py: 1.5,
                        px: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        opacity: participant.active ? 1 : 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 400 }}>
                          {participant.name}
                        </Typography>
                        {participant.gender && (
                          <Chip
                            label={participant.gender}
                            size="small"
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          />
                        )}
                        <Chip
                          label={participant.active ? 'Active' : 'Inactive'}
                          size="small"
                          onClick={() => handleToggleActive(participant.id)}
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem',
                            cursor: 'pointer',
                            background: participant.active 
                              ? 'rgba(102, 126, 234, 0.2)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            border: participant.active
                              ? '1px solid rgba(102, 126, 234, 0.3)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            color: participant.active ? 'rgb(102, 126, 234)' : 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              background: participant.active 
                                ? 'rgba(102, 126, 234, 0.3)' 
                                : 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        />
                      </Box>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEdit(participant)}
                          size="small"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: 'rgba(255, 255, 255, 0.8)',
                              background: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(participant.id)}
                          size="small"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: 'rgba(255, 100, 100, 0.8)',
                              background: 'rgba(255, 100, 100, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button 
            onClick={handleClose}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              px: 3,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
