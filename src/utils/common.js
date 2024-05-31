import { HOST_API } from 'src/config-global';

export const convertImagePathToUrl = (filePath, dimension) => {
  if (!filePath) return undefined;
  return `${HOST_API}/api/v1/files${dimension ? `/${dimension}x${dimension}` : ''}/${filePath}`;
};

export const convertImageUrlToPath = (url = '') => {
  if (!url) return undefined;
  const paths = url.split('/');
  return paths[paths.length - 1];
};
// const atts2 = [
//   { name: "Màu sắc", values: ["xanh", "do"] },
//   { name: "Size", values: ["S", "M"] },
// ];
// const atts1 = [{ name: "Màu sắc", values: ["xanh", "do"] }];

// const atts3 = [
//   { name: "Màu sắc", values: ["xanh", "do"] },
//   { name: "Size", values: ["S", "M"] },
//   { name: "Chất liệu", values: ["Cotton", "Nỉ"] },
//   { name: "Giới tính", values: ["Nam", "Nữ"] },
//   { name: "Quy cách", values: ["1 Khuya", "2 Khuy", "3 Khuy"] },
// ];
export function makeProductVariantsFromAttributes(attributes) {
  // if (attributes.length === 1)
  //   return attributes[0].values.map((i) => [{ name: attributes[0].name, value: i }]);
  return attributes.reduce(
    (acc, item) =>
      acc.flatMap((variant) =>
        item.values.map((value) =>
          Array.isArray(variant)
            ? [...variant, { name: item.name, value }]
            : [
                { name: variant.name, value: variant.value },
                { name: item.name, value },
              ]
        )
      ),
    [[]]
  );
}
