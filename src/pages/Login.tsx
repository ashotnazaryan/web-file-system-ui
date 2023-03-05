import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ROUTES, AUTH_KEY } from 'shared/constants';
import { saveToLocalStorage } from 'shared/helpers';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const auth = { isLoggedIn: true, token: codeResponse.access_token };

        saveToLocalStorage(AUTH_KEY, auth);
        navigate(ROUTES.dashboard.path);
      } catch (error) {
        console.error(error);
      }
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return (
    <Box display='flex' justifyContent='center' alignItems='center' flexGrow={1}>
      <Button variant='outlined' onClick={() => googleLogin()}>Google Login</Button>
    </Box>
  );
};

export default Login;
