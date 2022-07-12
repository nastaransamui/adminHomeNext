import videoStyles from './video-styles';
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
import videoHook from './videoHook';
import { Stories } from './videoStatic';
import useButtonActivation from '../../Hooks/useButtonActivation';

export default function Video(props) {
  const classes = videoStyles();
  const history = useHistory();
  const { t, i18n } = useTranslation('video');
  const lang = i18n.language == 'fa' ? 'fa' : 'en';
  const { rtlActive, reactRoutes } = props;

  const {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    videoLinkBlob,
    imageMobileBlob,
    videoPosterBlob,
    submitForm,
    pushUrl,
    _id,
    videoRoute,
  } = videoHook(reactRoutes);

  const { createButtonDisabled, updateButtonDisabled } =
    useButtonActivation(videoRoute);
    console.log(values)
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
      <Heading title={values[`title_${lang}`] == '' ? t('VideoTitle') :values[`title_${lang}`]  } textAlign='center' />
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
                      videoLinkBlob,
                      imageMobileBlob,
                      videoPosterBlob
                    )}
                  />
                  <Grid container justifyContent='center'>
                    <Tooltip title={t('onlyOne')} placement='top' arrow>
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
