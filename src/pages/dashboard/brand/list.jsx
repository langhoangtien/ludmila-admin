import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card, Button, Dialog, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';

// Thay đổi từ 'category' thành 'brand'

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EditForm from './editform'; // Thay đổi từ 'category' thành 'brand'

const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', search: true },
  { id: 'code', label: 'Code', align: 'left', search: true },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function BrandListPage() {
  const [current, setCurrent] = useState(null);
  const dialog = useBoolean();

  const addNewBrand = () => {
    setCurrent(null);
    dialog.onTrue();
  };
  const settings = useSettingsContext();
  const handleOpenDialog = (item) => {
    setCurrent(item);
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
            moduleName="Thương hiệu"
            tableHead={TABLE_HEAD}
            apiURL={endpoints.brand.list}
            mapFunction={(brand) => ({
              ...brand,
              name: (
                <Typography
                  onClick={() => handleOpenDialog(brand)}
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
        <EditForm dialog={dialog} current={current} />
      </Dialog>
    </>
  );
}
