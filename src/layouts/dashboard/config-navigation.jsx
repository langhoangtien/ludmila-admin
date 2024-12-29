import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  category: icon('ic_category'),
  country: icon('ic_country'),
  brand: icon('ic_brand'),
  product: icon('ic_product'),
  customer: icon('ic_customer'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('profile'), path: paths.dashboard.user.root },
              { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.user.list },
              { title: t('create'), path: paths.dashboard.user.new },
              { title: t('edit'), path: paths.dashboard.user.demo.edit },
              { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          // CATEGORY
          {
            title: t('category'),
            path: paths.dashboard.category.root,
            icon: ICONS.category,
          },

          // COUNTRY
          {
            title: t('country'),
            path: paths.dashboard.country.root,
            icon: ICONS.country,
          },

          // BRAND
          {
            title: t('brand'),
            path: paths.dashboard.brand.root,
            icon: ICONS.brand,
          },

          // PRODUCT
          {
            title: t('product'),
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              { title: t('list'), path: paths.dashboard.product.root },

              { title: t('create'), path: paths.dashboard.product.new },
            ],
          },

          // CUSTOMER
          {
            title: t('customer'),
            path: paths.dashboard.customer.root,
            icon: ICONS.customer,
          },

          // ORDER
          {
            title: t('order'),
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              { title: t('list'), path: paths.dashboard.order.root },
              { title: t('details'), path: paths.dashboard.order.demo.details },
            ],
          },

          // PAGE

          {
            title: t('page'),
            path: paths.dashboard.page.root,
            icon: ICONS.kanban,
            children: [
              { title: t('list'), path: paths.dashboard.page.root },
              { title: t('create'), path: paths.dashboard.page.new },
            ],
          },
        ],
      },

      // DEMO MENU STATES
    ],
    [t]
  );

  return data;
}
