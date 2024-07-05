import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Grid, Button, Container, Typography, CircularProgress } from '@mui/material';

import { confirmEmail } from 'src/api/auth';
import { REDIRECT_URL } from 'src/config-global';

export default function ConfirmEmailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(true);
  const [textError, setError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timer, setTimer] = useState(null);
  const hash = queryParams.get('hash');

  useEffect(() => {
    const confirm = async () => {
      try {
        if (!hash) {
          setError(true);
          return;
        }
        await confirmEmail(hash);
        setError(false);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    confirm();
  }, [hash]);

  useEffect(() => {
    if (!loading) {
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
  }, [countdown, loading]);

  const handleRedirectClick = () => {
    clearTimeout(timer); // Clear the timeout when redirect link is clicked
    window.location.replace(REDIRECT_URL); // Redirect immediately
  };
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item sx={{ justifyContent: 'center', alignContent: 'center', p: 4 }} xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <ConfirmError
              onRedirect={handleRedirectClick}
              countdown={countdown}
              isError={textError}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

const ConfirmError = ({ isError, countdown, onRedirect }) => {
  if (isError)
    return (
      <>
        <ExpriedSVG />
        <Typography color="error.main">Liên kết không chính xác hoặc đã hết hạn</Typography>
        <Typography color="error.main">Xin lỗi vì sự bất tiện này</Typography>
        <Typography color="success.main">
          Hệ thống sẽ tự động quay về trang chủ sau{' '}
          <Box color="warning.main" component="span">
            {countdown}s
          </Box>{' '}
          . Hoặc nhấn vào link bên dưới{' '}
        </Typography>
        <Button variant="contained" onClick={onRedirect}>
          {' '}
          Về trang chủ
        </Button>
      </>
    );

  return (
    <>
      <Typography color="success.main">
        Xác nhận email thành công. hệ thống sẽ tự động quay về trang chủ sau{' '}
        <Box color="warning.main" component="span">
          {countdown}s
        </Box>{' '}
        . Hoặc nhấn vào link bên dưới{' '}
      </Typography>
      <Button variant="contained" onClick={onRedirect}>
        {' '}
        Về trang chủ
      </Button>
    </>
  );
};

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

ConfirmError.propTypes = {
  isError: PropTypes.bool,
  countdown: PropTypes.number,
  onRedirect: PropTypes.func.isRequired,
};
