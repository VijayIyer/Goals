import React, { useState } from 'react';
import {TextField, Button, Grid2, Typography} from '@mui/material';

interface SignUpValidationError {
    username: string;
    password: string;
    confirmPassword: string;
}
interface SignUpFormProps {
    onSignUp: (formData: {username:string, password: string, confirmPassword: string}) => void
}
function SignupForm({
    onSignUp
}: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: any) => {
    console.log(e)
    e.preventDefault();

    // Basic validation
    const newErrors = {
        username: '',
        password: '',
        confirmPassword: ''
    };
    if (!formData.username) {
      newErrors.username = 'username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (newErrors.username || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
    } else {
      // Perform signup logic here (e.g., send data to an API)
      onSignUp(formData);
    }
  };

  return (
    <Grid2 textAlign={"center"}>
        <Typography variant="h5" gutterBottom>
            Create New User
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

            <div>
                <TextField
                    error={Boolean(errors.confirmPassword)}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Match Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    helperText={errors.confirmPassword}
                    margin='normal'
                    />
            </div>

            <Button type="submit" variant='contained' color="primary">Create User</Button>
        </form>
    </Grid2>
  );
}

export default SignupForm;