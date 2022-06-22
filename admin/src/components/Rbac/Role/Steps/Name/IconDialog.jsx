import { forwardRef, useMemo } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Public from '@mui/icons-material/Public';
import Flag from '@mui/icons-material/Flag';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import AccountBalance from '@mui/icons-material/AccountBalance';
import AddBox from '@mui/icons-material/AddBox';
import Dashboard from '@mui/icons-material/Dashboard';
import AccountBox from '@mui/icons-material/AccountBox';
import Apps from '@mui/icons-material/Apps';
import AttachMoney from '@mui/icons-material/AttachMoney';
import DataThresholding from '@mui/icons-material/DataThresholding';
import Apartment from '@mui/icons-material/Apartment';
import SouthAmerica from '@mui/icons-material/SouthAmerica';
import Badge from '@mui/icons-material/Badge';
import Home from '@mui/icons-material/Home';
import Airlines from '@mui/icons-material/Airlines';
import AssignmentInd from '@mui/icons-material/AssignmentInd';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide className='animate__animated animate__zoomInDown' direction='up' ref={ref} {...props} />;
});

const IconDialog = (props) => {
  const { open,  handleClose } = props;
  const theme = useTheme();
  const { t, i18n } = useTranslation('roles');
  const Icons = useMemo(() => {
    return [
      Public,
      Flag,
      AccessAlarm,
      AccountBalance,
      AddBox,
      Dashboard,
      AccountBox,
      Apps,
      AttachMoney,
      DataThresholding,
      Apartment,
      SouthAmerica,
      Badge,
      Home,
      Airlines,
      AssignmentInd,
    ];
  });
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={()=>handleClose()}
        aria-describedby='alert-dialog-slide-description'>
        <DialogTitle>{t('chooseIcon')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description' >
            {Icons.map((Icon, i) => {
              return (
                <IconButton
                onClick={()=>handleClose(Icon)}
                  key={i}
                  disableFocusRipple
                  disableRipple
                  style={{
                    border: `1px solid ${
                      i % 2 !== 0
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }`,
                    margin: 5
                  }}>
                  <Icon
                    style={{
                      color:
                        i % 2 == 0
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      paddingBottom: 1,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                    }}
                  />
                </IconButton>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default  IconDialog