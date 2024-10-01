import { Button, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
//import Button from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import InputAdornment from '@mui/material';
import { database } from '../../utils/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

export default function AddForm({}) {
  const [Name, setName] = useState('');
  const [Number, setNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Age, setAge] = useState('');
  const [Gender, setGender] = useState('');
  const [Address, setAddress] = useState('');
  const [Symptoms, setSymptoms] = useState('');
  const [rows, setRows] = useState([]);
  const empCollectionRef = collection(database, 'patients');
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };
  const handleNumberChange = (event: any) => {
    setNumber(event.target.value);
  };
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };
  const handleAgeChange = (event: any) => {
    setAge(event.target.value);
  };
  const handleGenderChange = (event: any) => {
    setGender(event.target.value);
  };
  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };
  const handleSymptomsChange = (event: any) => {
    setSymptoms(event.target.value);
  };

  const createUser = async () => {
    await addDoc(empCollectionRef, {
      Name: Name,
      Number: +Number,
      Email: Email,
      Age: +Age,
      Gender: Gender,
      Address: Address,
      Symptoms: Symptoms
    });
    // getUsers();
  };

  // const getUsers = async () => {
  //   const data = await getDocs(empCollectionRef);
  //   setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  // };

  const currencies = [
    {
      value: 'Male',
      label: 'Male'
    },
    {
      value: 'Female',
      label: 'Female'
    }
  ];
  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Patient
      </Typography>
      <IconButton style={{ position: 'absolute', top: '0', right: '0' }}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            size="small"
            onChange={handleNameChange}
            value={Name}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Number"
            variant="outlined"
            size="small"
            onChange={handleNumberChange}
            value={Number}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            size="small"
            onChange={handleEmailChange}
            value={Email}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Age"
            variant="outlined"
            type="number"
            size="small"
            onChange={handleAgeChange}
            value={Age}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Gender"
            select
            variant="outlined"
            size="small"
            onChange={handleGenderChange}
            value={Gender}
            sx={{ minWidth: '100%' }}
          >
            {' '}
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            size="small"
            onChange={handleAddressChange}
            value={Address}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Symptoms"
            variant="outlined"
            size="small"
            onChange={handleSymptomsChange}
            value={Symptoms}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={createUser}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
