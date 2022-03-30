import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Zoom,
  useMediaQuery,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import userStyles from './user-style';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/styles';
export default function SidebarUser(props) {
  const {
    openCollapse,
    rtlActive,
    openAvatar,
    bgColor,
    propsMiniActive,
    stateMiniActive,
    adminAccessToken,
    t,
    handleDrawerToggle,
  } = props;
  const classes = userStyles();
  const history = useHistory();
  const theme = useTheme();
  const { stringLimit } = useSelector((state) => state);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const profile = jwt.verify(
    adminAccessToken,
    process.env.NEXT_PUBLIC_SECRET_KEY,
    (err, user) => {
      if (!err) {
        return user;
      }
    }
  );

  const userWrapperClass =
    classes.user +
    ' ' +
    cx({
      [classes.whiteAfter]: bgColor === 'white',
    });
  const photo =
    classes.photo +
    ' ' +
    cx({
      [classes.photoRTL]: rtlActive,
    });

  const caret =
    classes.caret +
    ' ' +
    cx({
      [classes.caretRTL]: rtlActive,
    });

  const itemText =
    classes.itemText +
    ' ' +
    cx({
      [classes.itemTextMini]: !propsMiniActive && stateMiniActive,
      [classes.itemTextMiniRTL]:
        rtlActive && !propsMiniActive && stateMiniActive,
      [classes.itemTextRTL]: rtlActive,
    });

  const collapseItemMini =
    classes.collapseItemMini +
    ' ' +
    cx({
      [classes.collapseItemMiniRTL]: rtlActive,
    });

  const collapseItemText =
    classes.collapseItemText +
    ' ' +
    cx({
      [classes.collapseItemTextMini]: !propsMiniActive && stateMiniActive,
      [classes.collapseItemTextMiniRTL]:
        rtlActive && !propsMiniActive && stateMiniActive,
      [classes.collapseItemTextRTL]: rtlActive,
    });

  return (
    <div className={userWrapperClass}>
      <div className={photo}>
        {profile?.profileImage !== '' ? (
          <img
            src={profile?.profileImage}
            className={classes.avatarImg}
            alt='...'
          />
        ) : (
          <AccountCircleIcon color='secondary' />
        )}
      </div>
      <List className={classes.list}>
        <ListItem className={classes.item + ' ' + classes.userItem}>
          <a
            href={'#'}
            className={classes.itemLink + ' ' + classes.userCollapseButton}
            onClick={(e) => {
              e.preventDefault();
              openCollapse('openAvatar');
            }}>
            <Tooltip
              title={`${profile.userName}`}
              TransitionComponent={Zoom}
              placement='top'
              arrow
              sx={{ marginLeft: 300 }}>
              <ListItemText
                primary={
                  profile.userName.length < stringLimit
                    ? `${profile.userName}`
                    : `${profile.userName.slice(0, stringLimit)} ...`
                }
                secondary={
                  <b
                    className={
                      caret +
                      ' ' +
                      classes.userCaret +
                      ' ' +
                      (openAvatar ? classes.caretActive : '')
                    }
                  />
                }
                disableTypography={true}
                className={itemText + ' ' + classes.userItemText}
              />
            </Tooltip>
          </a>
          <Collapse in={openAvatar} unmountOnExit>
            <List className={classes.list + ' ' + classes.collapseList}>
              <ListItem
                className={classes.collapseItem}
                onClick={(e) => {
                  e.preventDefault();
                  isMobile && handleDrawerToggle();
                  history.push({
                    pathname: '/admin/dashboard/user-page',
                    search: `?_id=${profile.id}`,
                    profile: profile,
                  });
                }}>
                <a
                  href='/admin/dashboard/user-page'
                  className={
                    classes.itemLink + ' ' + classes.userCollapseLinks
                  }>
                  {!isMobile && (
                    <span className={collapseItemMini}>
                      {rtlActive ? 'پ م' : 'MP'}
                    </span>
                  )}
                  <ListItemText
                    primary={t('MyProfile')}
                    disableTypography={true}
                    className={collapseItemText}
                  />
                </a>
              </ListItem>
            </List>
          </Collapse>
        </ListItem>
      </List>
    </div>
  );
}

SidebarUser.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  openAvatar: PropTypes.bool.isRequired,
  openCollapse: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  stateMiniActive: PropTypes.bool.isRequired,
  propsMiniActive: PropTypes.bool.isRequired,
  bgColor: PropTypes.string.isRequired,
};
