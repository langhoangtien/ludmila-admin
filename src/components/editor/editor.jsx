/* eslint-disable perfectionist/sort-imports */
import 'src/utils/highlight';

import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

import { alpha } from '@mui/material/styles';

import { useRef, useMemo, useCallback } from 'react';
import { uploadFile } from 'src/api/file';
import { convertImagePathToUrl } from 'src/utils/common';
import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  error,
  simple = false,
  helperText,
  sx,
  ...other
}) {
  // Remove the duplicate declaration of quillRef
  const quillRef = useRef();

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const urlData = await uploadFile(file);
        const url = convertImagePathToUrl(urlData.data.path);
        const quill = quillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          if (range) {
            quill.getEditor().insertEmbed(range.index, 'image', url);
          }
        }
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${id}`,
        handlers: {
          image: imageHandler,
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      syntax: true,
      clipboard: {
        matchVisual: false,
      },
    }),
    [id, imageHandler]
  );

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} simple={simple} />

        <ReactQuill
          // theme="snow"
          modules={modules}
          formats={formats}
          ref={quillRef}
          placeholder="Write something awesome..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}

Editor.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.object,
  id: PropTypes.string,
  simple: PropTypes.bool,
  sx: PropTypes.object,
};
