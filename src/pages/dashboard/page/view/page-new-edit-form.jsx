import * as Yup from 'yup';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { addPage, updatePage } from 'src/api/page';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFTextField } from 'src/components/hook-form';

export default function PageEditForm({ current }) {
  const router = useRouter();
  const NewPageSchema = Yup.object().shape(
    {
      slug: Yup.string().when('slug', (val, schema) => {
        if (val?.[0]) {
          return Yup.string().matches(
            /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim,
            'Requires correct slug url format'
          );
        }
        return Yup.string().notRequired();
      }),

      name: Yup.string().required('Name is required'),
      content: Yup.string().nullable(),
    },
    [['slug', 'slug']]
  );
  const defaultValues = useMemo(
    () => ({
      slug: current?.slug || '',
      name: current?.name || '',
      _id: current?._id || '',
      content: current?.content || '',
    }),
    [current]
  );
  const methods = useForm({ resolver: yupResolver(NewPageSchema), defaultValues });
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
        slug: data.slug
          ? data.slug
          : slugify(data.name, { locale: 'vi', remove: /[*+~.()'"!:@]/g }).toLowerCase(),
      };
      if (!values._id) await addPage(mappedData);
      if (values._id) await updatePage(values._id, mappedData);
      enqueueSnackbar('Page created successfully', { variant: 'success' });
      router.push(paths.dashboard.page.root);
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(() => {
    if (current) {
      setValue('slug', current.slug);
      setValue('name', current.name);
      setValue('_id', current._id);
      setValue('content', current.content);
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
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
              <Stack gap={2}>
                {' '}
                <RHFTextField required size="small" name="name" label="Tên trang" />{' '}
                <RHFTextField size="small" name="slug" label="Url trang" />
              </Stack>
              <Box gridColumn="span 2">
                {' '}
                <RHFEditor simple name="content" />
              </Box>
            </Box>
          </Stack>
        </Card>
      </Grid>

      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!values._id ? 'Create Page' : 'Save Changes'}
      </LoadingButton>
    </FormProvider>
  );
}

PageEditForm.propTypes = {
  current: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
    _id: PropTypes.string,
    content: PropTypes.string,
  }),
};
