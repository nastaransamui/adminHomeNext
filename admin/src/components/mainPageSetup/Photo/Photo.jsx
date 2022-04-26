import photoStyles from './photo-styles';
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
import photoHook from './photoHook';
import { Stories } from './photoStatic';

export default function Photo(props) {
  const classes = photoStyles();
  const history = useHistory();
  const {
    values,
    setValues,
    uploadFile,
    deleteFile,
    formValueChanged,
    imageBlob,
    submitForm,
    pushUrl,
  } = photoHook();

  const { t } = useTranslation('photos');
  const { rtlActive } = props;
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
                    <Button type='submit' variant='contained' color='primary'>
                      {t('submit')}
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
