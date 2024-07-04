import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useEffect } from 'react';
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

import { addCategory, getCategories, updateCategory } from 'src/api/category';

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', search: true },
  { id: 'code', label: 'Code', align: 'left', search: true },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function CategoryListPage() {
  const dialog = useBoolean();
  const [reload, setReload] = useState(true);
  const [categories, setCategories] = useState([]); // Thêm dòng này
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const NewCategorySchema = Yup.object().shape({
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
      parentId: '',
    }),
    []
  );
  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await getCategories();
        const categoriesData = responseData.data.items;
        setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []); // Thêm dòng này
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
      if (!values._id) await addCategory(data);
      if (values._id) await updateCategory(values._id, data);

      enqueueSnackbar('Category created successfully', { variant: 'success' });
      reset(defaultValues);
      setReload((prevReload) => !prevReload);
      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  const loadValue = (category) => {
    Object.keys(category).forEach((key) => {
      setValue(key, category[key]);
    });
    dialog.onTrue();
  };

  const addNewCategory = () => {
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
              onClick={addNewCategory}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
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
            apiURL={endpoints.category.list}
            mapFunction={(category) => ({
              ...category,
              name: (
                <Typography
                  onClick={() => loadValue(category)}
                  variant="subtitle1"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  {category.name}
                </Typography>
              ),

              createdAt: new Date(category.createdAt).toLocaleString('en-VN'),
            })}
          />
        </Card>
      </Container>
      <Dialog open={dialog.value} maxWidth="md" onClose={dialog.onFalse} fullWidth>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle>new Category</DialogTitle>
          <DialogContent>
            <Grid xs={12} md={4}>
              <Card>
                <CardHeader title="Avatar" />
                <Stack p={3} spacing={3}>
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
                  <RHFTextField required size="small" name="name" label="Category Name" />
                  <RHFTextField required size="small" name="code" label="Category Code" />
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
      </Dialog>
    </>
  );
}
