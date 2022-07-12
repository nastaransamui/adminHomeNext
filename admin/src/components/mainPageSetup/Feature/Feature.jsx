import featureStyles from './feature-styles';
import Heading from '../../Heading/Heading';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Card from '../../Card/Card';
import CardBody from '../../Card/CardBody';
import Timeline from '../../Timeline/Timeline';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useHistory } from 'react-router-dom';
import featureHook from './featureHook';
import { Stories } from './featureStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';

export default function Feature(props) {
  const classes = featureStyles();
  const { rtlActive, reactRoutes } = props;
  const history = useHistory();
  const {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    featureLinkBlob,
    featureThumbBlob,
    submitForm,
    pushUrl,
    _id,
    featureRoute,
  } = featureHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(featureRoute);

  const { t } = useTranslation('feature');
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
      <Heading title={t('FeatureTitle')} textAlign='center' />
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
                      featureLinkBlob,
                      featureThumbBlob
                    )}
                  />
                  <Grid container justifyContent='center'>
                    <Tooltip title={t('onlyThree')} placement='top' arrow>
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
