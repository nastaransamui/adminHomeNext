import { makeStyles, useTheme } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import { CircleToBlockLoading } from 'react-loadingg';
const useStyles = makeStyles((theme) => {
  return {
    progress: {
      width: '6rem !important',
      height: '6rem !important',
    },
    wrapperDiv: {
      margin: '50px auto',
      marginTop: -10,
      marginBottom: 10,
      minHeight: 200,
      padding: '0px',
      maxWidth: '360px',
      textAlign: 'center',
      position: 'relative',
      zIndex: '9999',
      top: '0',
    },
    iconWrapper: {
      display: 'block',
    },
    title: {
      color: '#FFFFFF',
    },
  };
});

const Loading = (props) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.wrapperDiv}>
        <div className={classes.iconWrapper}>
        <CircleToBlockLoading color={props.color} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
