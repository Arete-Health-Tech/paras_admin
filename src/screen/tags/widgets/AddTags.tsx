import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { createServiceTagsHandler } from '../../../api/service/serviceHandler';

type Props = {};

const AddTags = (props: Props) => {
  const [tag, setTag] = useState({
    name: ''
  });
  const [isDisabled, setDisabled] = useState(true);
  const checkButton = () => {
    if (tag.name.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleAddTag = async () => {
    await createServiceTagsHandler(tag);
    setTag({
      name: ''
    });
  };
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        onChange={(e) => {
          checkButton();
          setTag({ ...tag, name: e.target.value });
        }}
        variant="filled"
        size="small"
        label="Add New Tag"
        value={tag.name}
      />
      <Button onClick={handleAddTag} disabled={isDisabled} variant="contained">
        Add Tag
      </Button>
    </Stack>
  );
};

export default AddTags;
