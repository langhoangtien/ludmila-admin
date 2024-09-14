import * as Yup from 'yup';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fData } from 'src/utils/format-number';
import { convertImagePathToUrl, convertImageUrlToPath } from 'src/utils/common';

import { uploadFile } from 'src/api/file';
import { addBrand, updateBrand } from 'src/api/brand';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

export default function EditForm({ dialog, current }) {
  const NewBrandSchema = Yup.object().shape(
    {
      code: Yup.string().when('code', (val, schema) => {
        if (val?.[0]) {
          return Yup.string().matches(
            /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim,
            'Requires correct slug url format'
          );
        }
        return Yup.string().notRequired();
      }),

      name: Yup.string().required('Name is required'),
      image: Yup.mixed().nullable(),
      description: Yup.string().nullable(),
    },
    [['code', 'code']]
  );
  const defaultValues = useMemo(
    () => ({
      code: undefined,
      name: '',
      _id: '',
      image: undefined,
      description: '',
    }),
    []
  );
  const methods = useForm({ resolver: yupResolver(NewBrandSchema), defaultValues });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const mappedData = {
        ...data,
        image: convertImageUrlToPath(data.image),
        code: data.code
          ? data.code
          : slugify(data.name, { locale: 'vi', remove: /[*+~.()'"!:@]/g }).toLowerCase(),
      };
      if (!values._id) await addBrand(mappedData);
      if (values._id) await updateBrand(values._id, mappedData);
      enqueueSnackbar('Brand created successfully', { variant: 'success' });

      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(() => {
    if (current) {
      setValue('code', current.code);
      setValue('name', current.name);
      setValue('_id', current._id);
      setValue('description', current.description);
      setValue('image', convertImagePathToUrl(current.image));
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);
  const handleDropPhoto = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    try {
      const dataResponse = await uploadFile(file);
      const url = convertImagePathToUrl(dataResponse.data.path);

      setValue('image', url, { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle>new Brand</DialogTitle>
      <DialogContent>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title="Avatar" />
            <Stack p={3} spacing={3}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFUploadAvatar
                  name="image"
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

                <Stack gap={2}>
                  {' '}
                  <RHFTextField required size="small" name="name" label="Brand Name" />{' '}
                  <RHFTextField size="small" name="code" label="Brand Code" />
                  <RHFTextField
                    size="small"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                  />
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </DialogContent>

      <DialogActions>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!values._id ? 'Create Brand' : 'Save Changes'}
        </LoadingButton>
        <Button onClick={dialog.onFalse} variant="contained">
          Close
        </Button>
      </DialogActions>
    </FormProvider>
  );
}

EditForm.propTypes = {
  dialog: PropTypes.shape({
    onFalse: PropTypes.func.isRequired,
  }).isRequired,
  current: PropTypes.object,
};
