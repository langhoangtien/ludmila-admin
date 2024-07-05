import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MenuItem, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import { convertImagePathToUrl, convertImageUrlToPath } from 'src/utils/common';

import { uploadFile } from 'src/api/file';
import { addUser, getUser, updateUser } from 'src/api/user';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('firstName is required'),
    lastName: Yup.string().required('lastName is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    role: Yup.string().required('Role is required'),
    photo: Yup.mixed().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      role: 'user',
      email: '',
      photo: undefined,
      phoneNumber: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleDropPhoto = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    try {
      const dataResponse = await uploadFile(file);
      const url = convertImagePathToUrl(dataResponse.data.path);

      setValue('photo', url, { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const dataSend = {
      ...data,
      photo: convertImageUrlToPath(data.photo),
    };

    // return;
    try {
      if (id) {
        await updateUser(id, dataSend);
      } else {
        await addUser(dataSend);
      }

      reset();
      enqueueSnackbar(id ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const responseData = await getUser(id);

        const userData = responseData.data;
        const photo = convertImagePathToUrl(userData.photo);

        const user = {
          ...userData,
          photo,
        };
        reset(user);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [id, reset]);
  return (
    <>
      {loading && <SplashScreen />}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {id && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="photo"
                maxSize={3145728}
                onDrop={handleDropPhoto}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {id && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {id && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField size="small" name="firstName" label="First Name *" />
              <RHFTextField size="small" name="lastName" label="Last Name *" />
              <RHFTextField
                size="small"
                name="password"
                label="Password *"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField size="small" name="email" label="Email Address *" />
              <RHFTextField size="small" name="phoneNumber" label="Phone Number" />

              <RHFSelect size="small" label="Role *" name="role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="cilent">Client</MenuItem>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!id ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </FormProvider>
    </>
  );
}

UserNewEditForm.propTypes = {
  id: PropTypes.string,
};
