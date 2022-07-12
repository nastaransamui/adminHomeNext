import photoStyles from './photo-styles';
import Heading from '../../Heading/Heading';
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ArrowForward from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next';
import Card from '../../Card/Card';
import CardBody from '../../Card/CardBody';
import Timeline from '../../Timeline/Timeline';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useHistory } from 'react-router-dom';
import photoHook from './photoHook';
import { Stories } from './photoStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';
export default function Photo(props) {
  const classes = photoStyles();
  const history = useHistory();
  const { rtlActive, reactRoutes } = props;
  const {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    imageBlob,
    submitForm,
    pushUrl,
    _id,
    photoRoute,
  } = photoHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(photoRoute);

  const { t } = useTranslation('photos');
 
  return (
    <div style={{ minWidth: '100%' }}>
      <Tooltip title={t('goBack')} arrow placement='bottom'>
        <IconButton
          onClick={() => {
            history.push(pushUrl);
          }}>
          {rtlActive ? <ArrowForward /> : <ArrowBack />}
        </IconButton>
      </Tooltip>
      <Heading title={t('PhotoTitle')} textAlign='center' />
      <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
        <Grid container>
          <Grid item xs={12}>
            <Card plain>
              <CardBody plain>
                <ValidatorForm onSubmit={submitForm}>
                  <Timeline
                    stories={Stories(
                      rtlActive,
                      values,
                      setValues,
                      uploadFile,
                      deleteFile,
                      formValueChanged,
                      imageBlob
                    )}
                  />
                  <Grid container justifyContent='center'>
                    <Tooltip title={t('active')} placement='top' arrow>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.isActive}
                            color='primary'
                            name='isActive'
                            value={values.isActive}
                            onChange={(e) => {
                              values.isActive = !values.isActive;
                              setValues((oldValues) => ({ ...oldValues }));
                            }}
                          />
                        }
                        label={
                          <span className={classes.caption}>
                            {t('isActive')}
                          </span>
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid container justifyContent='center'>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      disabled={
                        _id == undefined
                          ? createButtonDisabled
                          : updateButtonDisabled
                      }>
                      {_id == undefined ? t('submit') : t('edit')}
                    </Button>
                  </Grid>
                </ValidatorForm>
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
