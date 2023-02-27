import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Currency } from 'shared/models';

interface SummaryProps {
  incomes: number;
  expenses: number;
  balance: number;
  currencySymbol: Currency['symbol'];
}

const Summary: React.FC<SummaryProps> = ({ incomes, expenses, balance, currencySymbol }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        paddingX: 2,
        paddingTop: 2,
        paddingBottom: 4,
        borderRadius: 1
      }}
    >
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant='h5' color='primary.contrastText' sx={{ textAlign: 'center', marginBottom: 2 }}>
            Summary
          </Typography>
        </Grid>
        <Grid container flexWrap='nowrap' sx={{ backgroundColor: 'primary.dark', borderRadius: 1 }}>
          <Grid item xs={6}>
            <Typography variant='subtitle1' color='primary.contrastText' component='p' sx={{ textAlign: 'center' }}>
              Total Income
            </Typography>
            <Typography color='primary.contrastText' sx={{ textAlign: 'center' }}>{currencySymbol}{incomes}</Typography>
          </Grid>
          <Divider orientation='vertical' sx={{ backgroundColor: 'primary.light' }} flexItem />
          <Grid item xs={6}>
            <Typography variant='subtitle1' color='primary.contrastText' component='p' sx={{ textAlign: 'center' }}>
              Total Expenses
            </Typography>
            <Typography color='primary.contrastText' sx={{ textAlign: 'center' }}>{currencySymbol}{expenses}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: 'primary.light', borderRadius: 1, paddingY: 2 }}>
            <Typography variant='h6' color='primary.contrastText' component='p' sx={{ textAlign: 'center' }}>
              Remaining Monthly Balance
            </Typography>
            <Typography variant='h6' color={balance > 0 ? 'primary.contrastText' : 'secondary.main'} sx={{ textAlign: 'center' }}>{currencySymbol}{balance}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
