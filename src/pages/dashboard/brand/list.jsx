import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Button,
  Dialog,
  Container,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';

import { addBrand, updateBrand } from 'src/api/brand'; // Thay đổi từ 'category' thành 'brand'

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';

const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', search: true },
  { id: 'code', label: 'Code', align: 'left', search: true },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function BrandListPage() {
  // Thay đổi từ 'CategoryListPage' thành 'BrandListPage'
  const dialog = useBoolean();

  const [reload, setReload] = useState(true);
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const NewBrandSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim, 'Requires correct slug url format')
      .required('Code is required'),
    name: Yup.string().required('Name is required'),
  });
  const defaultValues = useMemo(
    () => ({
      code: '',
      name: '',
      _id: '',
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
      if (!values._id) await addBrand(data); // Thay đổi từ 'addCategory' thành 'addBrand'
      if (values._id) await updateBrand(values._id, data); // Thay đổi từ 'updateCategory' thành 'updateBrand'

      enqueueSnackbar('Brand created successfully', { variant: 'success' });
      reset(defaultValues);
      setReload((prevReload) => !prevReload);
      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  const loadValue = (brand) => {
    Object.keys(brand).forEach((key) => {
      setValue(key, brand[key]);
    });
    dialog.onTrue();
  };

  const addNewBrand = () => {
    reset(defaultValues);
    dialog.onTrue();
  };
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Product',
              href: paths.dashboard.product.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={addNewBrand}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Brand
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            // height: { xs: 800, md: 2000 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <ApiTable
            reload={reload}
            tableHead={TABLE_HEAD}
            apiURL={endpoints.brand.list} // Thay đổi từ 'category.list' thành 'brand.list'
            mapFunction={(brand) => ({
              // Thay đổi từ 'category' thành 'brand'
              ...brand, // Thay đổi từ 'category' thành 'brand'
              name: (
                <Typography
                  onClick={() => loadValue(brand)}
                  variant="subtitle1"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  {brand.name}
                </Typography>
              ),

              createdAt: new Date(brand.createdAt).toLocaleString('en-VN'),
            })}
          />
        </Card>
      </Container>
      <Dialog open={dialog.value} maxWidth="md" onClose={dialog.onFalse} fullWidth>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle>new Brand</DialogTitle>
          <DialogContent>
            <Grid xs={12} md={4}>
              <Card>
                <CardHeader title="Avatar" />
                <Stack p={3} spacing={3}>
                  <RHFTextField required size="small" name="name" label="Brand Name" />
                  <RHFTextField required size="small" name="code" label="Brand Code" />
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
      </Dialog>
    </>
  );
}
