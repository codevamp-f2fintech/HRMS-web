import React, { useState, useEffect } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'
import { Break } from '@/redux/features/breaksheets/breaksSlice'

interface EditBreakFormProps {
    open: boolean
    onClose: () => void
    onSubmit: (updatedBreak: Break) => void
    breakToEdit: Break | null
}

const breakOptions = ['Washroom', 'Lunch', 'Refreshment', 'Tea', 'Personal Call', 'Other'];

const EditBreakForm: React.FC<EditBreakFormProps> = ({ open, onClose, onSubmit, breakToEdit }) => {
    const [formValues, setFormValues] = useState({
        type: '',
        startTime: '',
        duration: '',
    })

    const [otherBreakType, setOtherBreakType] = useState<string>('')

    useEffect(() => {
        if (breakToEdit) {
            setFormValues({
                type: breakToEdit.type || '',
                startTime: breakToEdit.startTime || '',
                duration: breakToEdit.duration || '',
            })

            if (!breakOptions.includes(breakToEdit.type)) {
                setOtherBreakType(breakToEdit.type);
                setFormValues(prevState => ({ ...prevState, type: 'Other' }));
            }
        }
    }, [breakToEdit])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormValues(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleOtherTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherBreakType(e.target.value)
    }

    const handleSubmit = () => {
        if (breakToEdit) {
            const finalBreakType = formValues.type === 'Other' ? otherBreakType : formValues.type
            onSubmit({ ...breakToEdit, type: finalBreakType, startTime: formValues.startTime, duration: formValues.duration })
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Break</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Break Type"
                    name="type"
                    value={formValues.type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {breakOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                {formValues.type === 'Other' && (
                    <TextField
                        label="Please specify"
                        value={otherBreakType}
                        onChange={handleOtherTypeChange}
                        fullWidth
                        margin="normal"
                    />
                )}

                <TextField
                    label="Start Time"
                    name="startTime"
                    value={formValues.startTime}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Duration"
                    name="duration"
                    value={formValues.duration}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="secondary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditBreakForm
