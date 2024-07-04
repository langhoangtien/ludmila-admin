import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';
import { Card, Grid, Stack, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';

export default function CategoryEditPage() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const NewCategorySchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
  });
  const defaultValues = useMemo(
    () => ({
      code: '',
      name: '',
    }),
    []
  );

  const methods = useForm({ resolver: yupResolver(NewCategorySchema), defaultValues });
  const {
    reset,

    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    if (id) reset(defaultValues);
  }, [defaultValues, reset, id]);
  return (
    <>
      <Helmet>
        <title> Dashboard: Category Edit</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new category"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Category',
              href: paths.dashboard.category.root,
            },
            { name: 'New category' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <FormProvider methods={methods} onSubmit={() => alert('submit form')}>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card>
                <CardHeader title="Avatar" />
                <Stack p={3} spacing={3}>
                  <RHFTextField required size="small" name="name" label="Category Name" />
                  <RHFTextField required size="small" name="code" label="Category Code" />
                </Stack>
              </Card>
            </Grid>
            <Grid xs={12}>
              <Stack justifyContent="flex-end" direction="row" p={3} spacing={2}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {!id ? 'Create Product' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
