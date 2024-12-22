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
  MenuItem,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fData } from 'src/utils/format-number';
import { convertImagePathToUrl, convertImageUrlToPath } from 'src/utils/common';

import { uploadFile } from 'src/api/file';
import { addCategory, updateCategory } from 'src/api/category';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

export default function EditForm({ dialog, categories, categoryCurrent }) {
  const NewCategorySchema = Yup.object().shape(
    {
      code: Yup.string().when('code', (val, schema) => {
        if (val?.[0]) {
          console.log('val_cate', val);

          return Yup.string().matches(
            /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim,
            'Requires correct slug url format'
          );
        }
        return Yup.string().notRequired();
      }),

      name: Yup.string().required('Name is required'),
      icon: Yup.string(),
    },
    [['code', 'code']]
  );
  const defaultValues = useMemo(
    () => ({
      code: undefined,
      name: '',
      _id: '',
      parentId: null,
      icon: '',
    }),
    []
  );
  const methods = useForm({ resolver: yupResolver(NewCategorySchema), defaultValues });
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
      if (!values._id) await addCategory(mappedData);
      if (values._id) await updateCategory(values._id, mappedData);
      enqueueSnackbar('Category created successfully', { variant: 'success' });

      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(() => {
    if (categoryCurrent) {
      setValue('code', categoryCurrent.code);
      setValue('name', categoryCurrent.name);
      setValue('parentId', categoryCurrent.parentId);
      setValue('_id', categoryCurrent._id);
      setValue('icon', categoryCurrent.icon);
      setValue('image', convertImagePathToUrl(categoryCurrent.image, 80));
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryCurrent]);
  const handleDropPhoto = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    try {
      const dataResponse = await uploadFile(file);
      const url = convertImagePathToUrl(dataResponse.data.path, 80);

      setValue('image', url, { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle>new Category</DialogTitle>
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
                  maxSize={102400}
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
                      <br /> max size of {fData(102400)}
                    </Typography>
                  }
                />
                <Stack gap={2}>
                  <RHFSelect
                    size="small"
                    name="parentId"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    label="Parent Category"
                  >
                    <MenuItem value={null}>
                      <em>None</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFTextField size="small" name="icon" label="Icon" />

                  <RHFTextField required size="small" name="name" label="Category Name" />
                  <RHFTextField size="small" name="code" label="Category Code" />
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </DialogContent>

      <DialogActions>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!values._id ? 'Create Product' : 'Save Changes'}
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
  categories: PropTypes.array.isRequired,
  categoryCurrent: PropTypes.object,
};
