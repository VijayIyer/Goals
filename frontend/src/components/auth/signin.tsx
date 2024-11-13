import React, { useState } from 'react';
import {TextField, Button, Grid2, Typography} from '@mui/material';

interface SignInValidationError {
    username: string;
    password: string;
}
interface SignInFormProps {
    onSignIn: (formData: {username:string, password: string}) => void
}
function SignInForm({
    onSignIn
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Basic validation
    const newErrors: SignInValidationError = {
        username: '',
        password: ''
    };
    if (!formData.username) {
      newErrors.username = 'username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
    } else {
      // Perform signup logic here (e.g., send data to an API)
      onSignIn(formData);
    }
  };

  return (
    <Grid2 textAlign={"center"}>
        <Typography variant="h5" gutterBottom>
            Sign In With Existing User
        </Typography>
        <form onSubmit={handleSubmit}>
            <div>
                <TextField
                    error={Boolean(errors.username)}
                    id="username"
                    name="username"
                    label="Enter a User Name"
                    value={formData.username}
                    onChange={handleChange}
                    helperText={errors.username}
                    margin='normal'
                />
            </div>

            <div>
                <TextField
                    error={Boolean(errors.password)}
                    id="password"
                    name="password"
                    type="password"
                    label="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    helperText={errors.password}
                    margin='normal'
                />
            </div>


            <Button type="submit" variant='contained' color="primary">
                Sign In
            </Button>
        </form>
    </Grid2>
  );
}

export default SignInForm;