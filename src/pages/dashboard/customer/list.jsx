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
  MenuItem,
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

import { addCustomer, updateCustomer } from 'src/api/customer'; // Thêm import và thay đổi từ 'category' thành 'customer'

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

const TABLE_HEAD = [
  { id: 'fullName', label: 'Name', align: 'left', search: true },
  { id: 'phoneNumber', label: 'Phone number', align: 'left', search: true },
  { id: 'gender', label: 'Gender', align: 'left', search: true },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];
const GENDER = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
export default function CustomerListPage() {
  const dialog = useBoolean();
  const [reload, setReload] = useState(true);
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const NewCustomerSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string(),
  });
  const defaultValues = useMemo(
    () => ({
      fullName: '',
      phoneNumber: '',
      gender: 'other',
      _id: '',
    }),
    []
  );
  const methods = useForm({ resolver: yupResolver(NewCustomerSchema), defaultValues });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;
  const values = watch();

  // const add10000Customer = async () => {
  //   generateCustomerAPI();
  // };
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!values._id) await addCustomer(data); // Thay đổi từ 'addCategory' thành 'addCustomer'
      if (values._id) await updateCustomer(values._id, data); // Thay đổi từ 'updateCategory' thành 'updateCustomer'

      enqueueSnackbar('Customer created successfully', { variant: 'success' });
      reset(defaultValues);
      setReload((prevReload) => !prevReload);
      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  const loadValue = (customer) => {
    Object.keys(customer).forEach((key) => {
      setValue(key, customer[key]);
    });
    dialog.onTrue();
  };

  const addNewCustomer = () => {
    reset(defaultValues);
    dialog.onTrue();
  };
  return (
    <>
      <Helmet>
        <title> Dashboard: Customer List</title>
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
              name: 'Customer',
              href: paths.dashboard.customer.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={addNewCustomer}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Customer
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
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          {/* <Button onClick={add10000Customer} variant="contained">
            {' '}
            100k khach hang
          </Button> */}
          <ApiTable
            reload={reload}
            tableHead={TABLE_HEAD}
            apiURL={endpoints.customer.list}
            mapFunction={(customer) => ({
              ...customer,
              fullName: (
                <Typography
                  onClick={() => loadValue(customer)}
                  variant="subtitle1"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  {customer.fullName}
                </Typography>
              ),

              createdAt: new Date(customer.createdAt).toLocaleString('en-VN'),
            })}
          />
        </Card>
      </Container>
      <Dialog open={dialog.value} maxWidth="md" onClose={dialog.onFalse} fullWidth>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle>New Customer</DialogTitle>
          <DialogContent>
            <Grid xs={12} md={4}>
              <Card>
                <CardHeader title="Details" />
                <Stack p={3} spacing={3}>
                  <RHFTextField required size="small" name="fullName" label="Customer Name" />

                  <RHFTextField required size="small" name="phoneNumber" label="Phone number" />
                  <RHFSelect
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    label="Gender"
                    name="gender"
                  >
                    {GENDER.map((gender) => (
                      <MenuItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
              </Card>
            </Grid>
          </DialogContent>
          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!values._id ? 'Create Customer' : 'Save Changes'}
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
