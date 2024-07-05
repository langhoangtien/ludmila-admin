import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Grid,
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { resetPassword } from 'src/api/auth';
import { REDIRECT_URL } from 'src/config-global';

export default function PasswordChangePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [textError, setError] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timer, setTimer] = useState(null);
  const hash = queryParams.get('hash');
  const expires = queryParams.get('expires');

  const [password, setPassword] = useState('');

  useEffect(() => {
    const date = new Date(expires);
    if (date < new Date() || !hash || !expires) {
      setError(true);
    }
  }, [hash, expires]);
  useEffect(() => {
    if ((isSubmit && !loading) || textError) {
      const timerId = setTimeout(() => {
        // Giảm thời gian đếm ngược mỗi giây
        if (countdown > 0) {
          setCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          // Sau khi hết thời gian đếm ngược, chuyển hướng về trang chủ
          window.location.replace(REDIRECT_URL);
        }
      }, 1000); // Thực hiện mỗi giây

      setTimer(timerId); // Save the timer ID in state

      clearTimeout(timerId);
    }
  }, [countdown, isSubmit, loading, textError]);

  const handleRedirect = () => {
    clearTimeout(timer); // Clear the timeout when redirect link is clicked
    window.location.replace(REDIRECT_URL); // Redirect immediately
  };
  const handleSubmit = async () => {
    if (password) {
      setLoading(true);
      try {
        await resetPassword({ hash, password });
        setSubmit(true);
      } catch (error) {
        console.error(error);
        setError(true);
        setSubmit(true);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item sx={{ justifyContent: 'center', alignContent: 'center', p: 4 }} xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {textError && (
                <>
                  <ExpriedSVG />
                  <Typography color="error.main">
                    Liên kết không chính xác hoặc đã hết hạn
                  </Typography>
                  <Typography color="error.main">Xin lỗi vì sự bất tiện này!</Typography>
                  <Typography color="success.main">
                    Hệ thống sẽ tự động quay về trang chủ sau{' '}
                    <Box color="warning.main" component="span">
                      {countdown}s
                    </Box>{' '}
                    . Hoặc nhấn vào link bên dưới{' '}
                  </Typography>
                  <Button variant="contained" onClick={handleRedirect}>
                    {' '}
                    Về trang chủ
                  </Button>
                </>
              )}

              {!isSubmit && !textError && (
                <form onSubmit={handleSubmit}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      type="password"
                      label="Mật khẩu mới"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Button type="submit" variant="contained" color="primary">
                      Lưu lại
                    </Button>
                  </Grid>
                </form>
              )}
              {isSubmit && !textError && (
                <>
                  <Typography color="success.main">
                    Thay đổi mật khẩu thành công. Hệ thống sẽ tự động quay về trang chủ sau{' '}
                    <Box color="warning.main" component="span">
                      {countdown}s
                    </Box>{' '}
                    . Hoặc nhấn vào link bên dưới{' '}
                  </Typography>
                  <Button variant="contained" onClick={handleRedirect}>
                    {' '}
                    Về trang chủ
                  </Button>
                </>
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

const ExpriedSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    role="img"
    focusable="false"
    aria-hidden="true"
  >
    <g transform="translate(.23100119 .14285704) scale(.28571)">
      <circle cx="17" cy="17" r="14" fill="gray" />

      <circle cx="17" cy="17" r="11" fill="#eee" />

      <path d="M16 8h2v9h-2z" />

      <path d="M22.6545993 20.9544007l-1.69680008 1.69680008-4.80760014-4.80760014 1.69680007-1.69680007z" />

      <circle cx="17" cy="17" r="2" />

      <circle cx="17" cy="17" r="1" fill="gray" />

      <path
        fill="#ffc107"
        d="M11.9 42l14.4-24.1c.8-1.3 2.7-1.3 3.4 0L44.1 42c.8 1.3-.2 3-1.7 3H13.6c-1.5 0-2.5-1.7-1.7-3z"
      />

      <path d="M26.4 39.9c0-.2 0-.4.1-.6.1-.2.2-.3.3-.5.1-.2.3-.2.5-.3.2-.1.4-.1.6-.1.2 0 .5 0 .7.1.2.1.4.2.5.3.1.1.2.3.3.5.1.2.1.4.1.6 0 .2 0 .4-.1.6-.1.2-.2.3-.3.5-.1.2-.3.2-.5.3-.2.1-.4.1-.7.1-.3 0-.5 0-.6-.1-.1-.1-.4-.2-.5-.3-.1-.1-.2-.3-.3-.5-.1-.2-.1-.4-.1-.6zm2.8-3.1h-2.3l-.4-9.8h3l-.3 9.8z" />
    </g>
  </svg>
);
