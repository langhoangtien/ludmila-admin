import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));

// CATEGORY
// const CategoryDetailsPage = lazy(() => import('src/pages/dashboard/category/details'));
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));

// COUNTRY
const CountryListPage = lazy(() => import('src/pages/dashboard/country/list'));
// BRAND
const BrandListPage = lazy(() => import('src/pages/dashboard/brand/list'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// CUSTOMER
const CustomerListPage = lazy(() => import('src/pages/dashboard/customer/list'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

const ListPage = lazy(() => import('src/pages/dashboard/page/list'));
const CreatePage = lazy(() => import('src/pages/dashboard/page/new'));
const EditPage = lazy(() => import('src/pages/dashboard/page/edit'));
// TEST RENDER PAGE BY ROLE

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <RoleBasedGuard hasContent roles={['admin', 'user']}>
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },

      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'category',
        children: [
          { element: <CategoryListPage />, index: true },
          { path: 'list', element: <CategoryListPage /> },
        ],
      },
      {
        path: 'country',
        children: [
          { element: <CountryListPage />, index: true },
          { path: 'list', element: <CountryListPage /> },
        ],
      },
      {
        path: 'brand',
        children: [
          { element: <BrandListPage />, index: true },
          { path: 'list', element: <BrandListPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'customer',
        children: [
          { element: <CustomerListPage />, index: true },
          { path: 'list', element: <CustomerListPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'page',
        children: [
          { element: <ListPage />, index: true },
          { path: 'list', element: <ListPage /> },
          { path: 'new', element: <CreatePage /> },
          { path: ':id/edit', element: <EditPage /> },
        ],
      },
    ],
  },
];
