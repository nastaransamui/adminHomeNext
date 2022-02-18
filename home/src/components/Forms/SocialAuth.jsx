import formStyles from './form-style';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
export default function SocialAuth() {
  const classes = formStyles();
  const router = useRouter();
  const { t } = useTranslation('auth');
  const handleSocial = async (network) => {
    const currentUrl = window.location.href;
    const encodedParam = encodeURI(`?redirectUrl=${currentUrl}`);
    window.location.href = `${process.env.NEXT_PUBLIC_API_AUTH}${network}${encodedParam}`;
  };

  return (
    <div className={classes.socmedSideLogin}>
      <Button
        variant='contained'
        className={classes.naviBtn}
        type='button'
        size='large'
        value='facebook'
        onClick={(e) => {
          handleSocial("facebook")
        }}>
        <i className='ion-social-facebook' />
        {t('facebook')}
      </Button>
      <Button
        variant='contained'
        className={classes.blueBtn}
        type='button'
        size='large'
        value='twitter'
        onClick={() => {
          handleSocial('twitter')
        }}>
        <i className='ion-social-twitter' />
        {t('twitter')}
      </Button>
      <Button
        variant='contained'
        className={classes.redBtn}
        type='button'
        size='large'
        value='google'
        onClick={(e) => {
          handleSocial('google')
        }}>
        <i className='ion-social-google' />
        {t('google')}
      </Button>
    </div>
  );
}
