import { Suspense, useState } from 'react';

import {
  Card,
  Button,
  Avatar,
  Dialog,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';
import { convertImagePathToUrl } from 'src/utils/common';

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'firstName', label: 'First Name', align: 'left', search: true },
  { id: 'lastName', label: 'Last Name', align: 'left', search: true },
  { id: 'email', label: 'Email', align: 'left', search: true },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'provider', label: 'Provider', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function UserListView() {
  const settings = useSettingsContext();
  const dialog = useBoolean();
  const [id, setId] = useState(null);
  const handleDialog = (idx) => {
    setId(idx);
    dialog.onTrue();
  };
  return (
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
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={() => handleDialog(null)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New User
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
          apiURL={endpoints.user.list}
          mapFunction={(user) => ({
            ...user,
            name: (
              <Typography
                onClick={() => handleDialog(user._id)}
                variant="subtitle1"
                sx={{ color: 'primary.main', cursor: 'pointer' }}
              >
                {user.firstName} {user.lastName}
              </Typography>
            ),
            photo: <Avatar src={convertImagePathToUrl(user.photo)} />,
            createdAt: new Date(user.createdAt).toLocaleString('en-VN'),
            fat: 5,
          })}
        />
      </Card>{' '}
      <Dialog open={dialog.value} maxWidth="xl" scroll="body" onClose={dialog.onFalse}>
        <DialogTitle>New User</DialogTitle>
        <DialogContent>
          <Suspense fallback={<div>Loading...</div>}>
            <UserNewEditForm id={id} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------
