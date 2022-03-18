import { Collapse, List, ListItem, ListItemText } from '@mui/material';
import userStyles from './user-style';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
export default function SidebarUser({
  openCollapse,
  rtlActive,
  openAvatar,
  bgColor,
  propsMiniActive,
  stateMiniActive,
  routes,
  router,
  t,
}) {
  const classes = userStyles();
  const history = useHistory();
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
        <img
          src='/admin/images/faces/avatar.jpg'
          className={classes.avatarImg}
          alt='...'
        />
      </div>
      <List className={classes.list}>
        <ListItem className={classes.item + ' ' + classes.userItem}>
          <a
            href={'#'}
            className={classes.itemLink + ' ' + classes.userCollapseButton}
            onClick={(e) => {
              e.preventDefault();
              openCollapse('openAvatar')
            }}>
            <ListItemText
              primary={rtlActive ? 'تانيا أندرو' : 'Tania Andrew'}
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
          </a>
          <Collapse in={openAvatar} unmountOnExit>
            <List className={classes.list + ' ' + classes.collapseList}>
              <ListItem className={classes.collapseItem} onClick={(e)=>{
                e.preventDefault();
                history.push({
                  pathname: '/admin/dashboard/user-page',
                  search: '?_id=hashem'
                });
              }}>
                <a
                  href='/admin/dashboard/user-page'
                  className={
                    classes.itemLink + ' ' + classes.userCollapseLinks
                  }>
                  <span className={collapseItemMini}>
                    {rtlActive ? 'پ م' : 'MP'}
                  </span>
                  <ListItemText
                    primary={t('MyProfile')}
                    disableTypography={true}
                    className={collapseItemText}
                  />
                </a>
              </ListItem>
              <ListItem className={classes.collapseItem}>
                <a
                  href='#'
                  className={
                    classes.itemLink + ' ' + classes.userCollapseLinks
                  }>
                  <span className={collapseItemMini}>
                    {rtlActive ? ' و پ' : 'EP'}
                  </span>
                  <ListItemText
                    primary={t('EditProfile')}
                    disableTypography={true}
                    className={collapseItemText}
                  />
                </a>
              </ListItem>
              <ListItem className={classes.collapseItem}>
                <a
                  href='#'
                  className={
                    classes.itemLink + ' ' + classes.userCollapseLinks
                  }>
                  <span className={collapseItemMini}>
                    {rtlActive ? 'تپ' : 'S'}
                  </span>
                  <ListItemText
                    primary={t('SettingsProfile')}
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
