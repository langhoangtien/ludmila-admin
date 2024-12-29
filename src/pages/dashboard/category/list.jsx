import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import { Card, Button, Dialog, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';

import { getCategories } from 'src/api/category';

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EditForm from './editform';

const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', search: true },
  { id: 'code', label: 'Code', align: 'left', search: true },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function CategoryListPage() {
  const dialog = useBoolean();

  const [categories, setCategories] = useState([]); // Thêm dòng này
  const settings = useSettingsContext();
  const [categoryCurrent, setCategory] = useState(null);

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
  }, []);

  const addNewCategory = () => {
    setCategory(null);
    dialog.onTrue();
  };
  const handleOpenDialog = (category) => {
    setCategory(category);
    dialog.onTrue();
  };
  return (
    <>
      <Helmet>
        <title> Danh mục</title>
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
              name: 'Danh mục',
              href: paths.dashboard.product.root,
            },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              onClick={addNewCategory}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Thêm mới
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
            tableHead={TABLE_HEAD}
            moduleName="Danh mục"
            apiURL={endpoints.category.list}
            mapFunction={(category) => ({
              ...category,
              name: (
                <Typography
                  onClick={() => handleOpenDialog(category)}
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
        <EditForm dialog={dialog} categories={categories} categoryCurrent={categoryCurrent} />
      </Dialog>
    </>
  );
}
