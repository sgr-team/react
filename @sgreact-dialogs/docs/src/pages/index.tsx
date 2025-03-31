import React, { type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { DialogProps, Provider } from '@sgreact/dialogs';
import { MUIDialogs, useMUIDialogs } from '@sgreact/dialogs-mui';
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Provider dialogs={MUIDialogs}>
        <Demo />
      </Provider>
    </Layout>
  );
}

function Demo() {
  const dialogs = useMUIDialogs();

  const handleAlert = React.useCallback(
    () => dialogs.alert('Alert title', 'Alert message'), 
    [ dialogs ]
  );
  const handleConfirm = React.useCallback(
    async () => {
      if (await dialogs.confirm('Confirm title', 'Confirm message')) {
        await dialogs.alert('Result', 'You clicked YES');
        return
      }

      await dialogs.alert('Result', 'You clicked NO');
    }, 
    [ dialogs ]
  );
  const handleCustom = React.useCallback(
    async () => {
      const answer = await dialogs.custom(CustomDialog, { defaultValue: 'Default value' });

      if (answer == null) {
        await dialogs.alert('Result', 'You canceled');
        return;
      }

      await dialogs.alert('Result', `You answered: ${answer}`);
    }, 
    [ dialogs ]
  );
  const handleError = React.useCallback(
    () => dialogs.error('Error title', new Error('Error message')),
    [ dialogs ]
  );
  
  return (
    <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box 
        sx={{ 
          width: 'calc(100% - 2rem)',
          display: 'flex',
          maxWidth: 1024,
          gap: 2,
        }}
      >
        <Button variant="contained" onClick={handleAlert}>Alert</Button>
        <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
        <Button variant="contained" onClick={handleCustom}>Custom</Button>
        <Button variant="contained" onClick={handleError}>Error</Button>
      </Box>
    </Box>
  );
}

function CustomDialog({ defaultValue, onClose }: CustomDialogProps) {
  const [ value, setValue ] = React.useState(defaultValue);

  const handleCancel = React.useCallback(() => onClose(null),[ onClose ]);
  const handleOk = React.useCallback(() => onClose(value), [ onClose, value ]);
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [ setValue ]);

  return (
    <>
      <DialogTitle>Custom Dialog Like a prompt</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            value={value}
            fullWidth
            onChange={handleChange}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>OK</Button>
      </DialogActions>
    </>
  );
}

type CustomDialogProps = DialogProps<string> & {
  defaultValue: string;
}
