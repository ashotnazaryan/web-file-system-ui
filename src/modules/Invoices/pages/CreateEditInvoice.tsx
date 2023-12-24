import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'core/i18n';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getExchangeRates,
  getInvoice,
  getProfile,
  resetCreateEditInvoiceStatus,
  resetGetInvoiceStatus,
  selectCurrentInvoice,
  selectInvoice,
  selectInvoiceAmount,
  selectInvoiceError,
  selectProfile,
  selectUser,
  setInvoiceAmount
} from 'store/reducers';
import { Currency, Invoice, InvoiceDTO, ManageMode } from 'shared/models';
import { getLastDateOfPreviousMonth, getPageTitle, mapUserProfileToInvoice } from 'shared/helpers';
import { ROUTES } from 'shared/constants';
import PageTitle from 'shared/components/PageTitle';
import Snackbar from 'shared/components/Snackbar';
import Dialog from 'shared/components/Dialog';
import InvoiceDocument from '../components/InvoiceDocument';
import InvoiceForm from '../components/InvoiceForm';
import { StyledPDFViewer } from './CreateEditInvoice.styles';

interface NewInvoiceProps {
  mode: ManageMode;
}

const CreateEditInvoice: React.FC<NewInvoiceProps> = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rate, getStatus, createEditStatus, deleteStatus } = useAppSelector(selectInvoice);
  const amount = useAppSelector(selectInvoiceAmount);
  const invoice = useAppSelector(selectCurrentInvoice);
  const error = useAppSelector(selectInvoiceError);
  const { status: profileStatus, userProfile } = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { state } = useLocation();
  const invoiceId = state?.id as InvoiceDTO['id'];
  const loading = createEditStatus === 'loading';
  const deleteLoading = deleteStatus === 'loading';
  const isEditMode = mode === ManageMode.edit;
  const isViewMode = mode === ManageMode.view;
  const [invoiceData, setInvoiceData] = React.useState<Partial<InvoiceDTO>>({} as InvoiceDTO);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
  const [deleteClicked, setDeleteClicked] = React.useState<boolean>(false);
  const [dialogOpened, setDialogOpened] = React.useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const title = getPageTitle<Invoice>(mode, t, getStatus, 'INVOICES', 'NEW_INVOICE', 'EMPTY_TITLE', invoice);

  const handleFormPreview = (data: Invoice): void => {
    const { salary, vatIncluded } = data;

    dispatch(setInvoiceAmount({ rate, salary, vatIncluded }));
    setInvoiceData({ ...data, amount });
  };

  const handleFormSubmit = (data: Invoice): void => {
    const { salary, vatIncluded } = data;

    dispatch(setInvoiceAmount({ rate, salary, vatIncluded }));
    setInvoiceData({ ...data, amount });
    setFormSubmitted(true);
    // TODO: fix, the amount is not updated at this point
    isEditMode ? dispatch(editInvoice([invoiceId, { ...data, amount }])) : dispatch(createInvoice({ ...data, amount }));
  };

  const handleCurrencyChange = (currencyIso: Currency['iso']): void => {
    dispatch(getExchangeRates([currencyIso, getLastDateOfPreviousMonth()]));
  };

  const handleEditButtonClick = (): void => {
    if (isEditMode) {
      return;
    }

    navigate(`${ROUTES.invoices.path}/edit/${invoice?.name}`, { state: { id: invoiceId } });
  };

  const handleCancelButtonClick = (): void => {
    isEditMode
      ? navigate(`${ROUTES.invoices.path}/view/${invoice?.name}`, { state: { id: invoiceId } })
      : navigate(ROUTES.invoices.path);
  };

  const handleOpenDialog = (): void => {
    setDialogOpened(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpened(false);
  };

  const handleDeleteInvoice = (): void => {
    dispatch(deleteInvoice(invoiceId));
    setDeleteClicked(true);
  };

  const handleSnackbarClose = (): void => {
    setShowSnackbar(false);
    setDeleteClicked(false);
  };

  const resetInvoice = React.useCallback(() => {
    dispatch(resetGetInvoiceStatus());
  }, [dispatch]);

  const goBack = React.useCallback(() => {
    navigate(`${ROUTES.invoices.path}`);
    resetInvoice();
  }, [navigate, resetInvoice]);

  React.useEffect(() => {
    if (createEditStatus === 'succeeded' && formSubmitted) {
      setShowSnackbar(false);
      dispatch(resetCreateEditInvoiceStatus());
      goBack();
    }

    if (createEditStatus === 'failed' && formSubmitted) {
      setShowSnackbar(true);
    }
  }, [dispatch, goBack, createEditStatus, formSubmitted]);

  React.useEffect(() => {
    setInvoiceData((prevInvoiceData) => ({ ...prevInvoiceData, amount }));
  }, [amount]);

  React.useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(getProfile());
    }

    if (profileStatus === 'succeeded') {
      const mappedInvoiceData = mapUserProfileToInvoice(user, userProfile);

      setInvoiceData((prevInvoiceData) => ({ ...prevInvoiceData, ...mappedInvoiceData }));
    }
  }, [dispatch, profileStatus, user, userProfile]);

  React.useEffect(() => {
    if (deleteStatus === 'succeeded' && deleteClicked) {
      goBack();
    }

    if (deleteStatus === 'failed' && deleteClicked) {
      setShowSnackbar(true);
      setDialogOpened(false);
    }
  }, [goBack, deleteStatus, deleteClicked]);

  React.useEffect(() => {
    if (invoiceId && getStatus === 'idle' && (isEditMode || isViewMode) && !deleteClicked) {
      dispatch(getInvoice(invoiceId));
    }
  }, [invoiceId, isEditMode, isViewMode, getStatus, dispatch, deleteClicked]);

  React.useEffect(() => {
    if (invoice && getStatus === 'succeeded' && (isEditMode || isViewMode)) {
      setInvoiceData(invoice);
    }
  }, [invoice, isEditMode, isViewMode, getStatus, dispatch]);

  return (
    <Box flexGrow={1}>
      <PageTitle
        withBackButton
        withEditButton={isViewMode && !!invoice}
        withDeleteButton={isEditMode && !!invoice}
        withCancelButton={!isViewMode && !!invoice}
        text={title}
        onBackButtonClick={goBack}
        onEditButtonClick={handleEditButtonClick}
        onDeleteButtonClick={handleOpenDialog}
        onCancelButtonClick={handleCancelButtonClick}
      />
      <Grid container columnSpacing={3} rowSpacing={5}>
        <Grid item xs={12} sm={6}>
          <InvoiceForm data={invoiceData} loading={loading} mode={mode} onPreview={handleFormPreview} onSubmit={handleFormSubmit} onCurrencyChange={handleCurrencyChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledPDFViewer>
            <InvoiceDocument data={invoiceData} />
          </StyledPDFViewer>
        </Grid>
      </Grid>
      <Snackbar type='error' open={showSnackbar} text={error?.messageKey ? t(error.messageKey) : error?.message || ''} onClose={handleSnackbarClose} />
      <Dialog
        fullWidth
        maxWidth='xs'
        title={t('INVOICES.DELETE_DIALOG_TITLE')!}
        actionButtonText={t('COMMON.YES')!}
        open={dialogOpened}
        loading={deleteLoading}
        onClose={handleCloseDialog}
        onAction={handleDeleteInvoice}
      >
        <Typography variant='subtitle1'>
          {t('INVOICES.DELETE_DIALOG_CONFIRM')}
        </Typography>
      </Dialog>
    </Box>
  );
};

export default CreateEditInvoice;
