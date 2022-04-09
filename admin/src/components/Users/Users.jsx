import {
  Fragment,
  useState,
  createRef,
  useEffect,
} from 'react';

import {
  Container,
  Grid,
  useTheme,
  Typography,
  Pagination,
  Tooltip,
  Badge,
  Popover,
  List,
  IconButton,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  ClickAwayListener,
  Box,
Button,
Switch
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRight from '@mui/icons-material/ArrowRight';
import ArrowLeft from '@mui/icons-material/ArrowLeft';

import { styled } from '@mui/material/styles';

import avatar from '../../../public/images/faces/avatar1.jpg';
import useAllUsersHook from '../Hooks/useAllUsersHook';
import usersStyle from './users-style';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardBody from '../Card/CardBody';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CardAvatar from '../Card/CardAvatar';


import { CircleToBlockLoading } from 'react-loadingg';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { setCookies } from 'cookies-next';

import {
  DeleteForeverOutlined,
  KeyboardArrowDown,
  Sort,
} from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import People from '@mui/icons-material/People';
import Public from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';




const StyledBox = styled(Container)(({ theme }) => ({
  padding: 10,
  border: '3px solid ',
  borderColor: theme.palette.primary.main,
  borderRadius: 5,
}));

const UserBox = styled(Container)(({ theme }) => ({
  border: '3px solid ',
  marginTop: 10,
  borderColor: theme.palette.secondary.main,
  borderRadius: 5,
  marginBottom: 10,
}));

export const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} disableFocusRipple disableRipple />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          theme.palette.primary.contrastText
        )}" d="M3 9h4V5H3v4zm0 5h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zM8 9h4V5H8v4zm5-4v4h4V5h-4zm5 9h4v-4h-4v4zM3 19h4v-4H3v4zm5 0h4v-4H8v4zm5 0h4v-4h-4v4zm5 0h4v-4h-4v4zm0-14v4h4V5h-4z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.secondary.main,
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '95%',
      height: '84%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        theme.palette.primary.contrastText
      )}" d="M21 8H3V4h18v4zm0 2H3v4h18v-4zm0 6H3v4h18v-4z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function Users(props) {
  const history = useHistory();
  const { t, rtlActive } = props;
  const id = open ? 'simple-popover' : undefined;
  const perPageId = openPerPage ? 'perpage-popover' : undefined;
  const sortPageId = openPerPage ? 'sortpage-popover' : undefined;

  const classes = usersStyle();
  const {
    loading,
    sweetAlert,
    requestSearch,
    searchText,
    rows: users,
  } = useAllUsersHook();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorPEl, setAnchorPEl] = useState(null);
  const [anchorSEl, setAnchorSEl] = useState(null);
  const [anchorSTl, setAnchorSTl] = useState({
    0: null,
  });
  const open = Boolean(anchorEl);
  const openPerPage = Boolean(anchorPEl);
  const openSortPage = Boolean(anchorSEl);
  const openSortType = Boolean(anchorSTl);
  const [elRefs, setElRefs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const {
    totalUsers,
    usersPerPage,
    usersPageNumber,
    stringLimit,
    profile,
    usersGrid,
    usersCardView,
  } = useSelector((state) => state);

  const theme = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    // add  refs
    setElRefs((elRefs) =>
      Array(totalUsers)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [totalUsers]);

  const userFields = [
    {
      icon: <InfoIcon style={{ color: theme.palette.secondary.main }} />,
      label: 'aboutMe',
    },
    {
      icon: <BadgeIcon style={{ color: theme.palette.primary.main }} />,
      label: 'firstName',
    },
    {
      icon: <BadgeIcon style={{ color: theme.palette.secondary.main }} />,
      label: 'lastName',
    },
    {
      icon: <LocationCityIcon style={{ color: theme.palette.primary.main }} />,
      label: 'city',
    },
    {
      icon: <FlagIcon style={{ color: theme.palette.secondary.main }} />,
      label: 'country',
    },
    {
      icon: <Public style={{ color: theme.palette.primary.main }} />,
      label: 'position',
    },
    {
      icon: <People style={{ color: theme.palette.secondary.main }} />,
      label: 'isAdmin',
    },
    {
      icon: <EventIcon style={{ color: theme.palette.primary.main }} />,
      label: 'updatedAt',
    },
    {
      icon: <EventIcon style={{ color: theme.palette.secondary.main }} />,
      label: 'createdAt',
    },
  ];

  return (
    <Container style={{ marginTop: 10, minHeight: '78vh' }} maxWidth='xl'>
      {loading ? (
        <Grid container spacing={2}>
          <CircleToBlockLoading color={theme.palette.secondary.main} />
        </Grid>
      ) : (
        <Fragment>
          <StyledBox maxWidth='xl'>
            <Grid className={classes.filterToolbar}>
              <Grid
                component='label'
                container
                className={classes.toolbarSwitch}>
                <Grid item>{t('tableview')}</Grid>
                <Grid item>
                  <MaterialUISwitch
                    color='secondary'
                    checked={usersCardView}
                    onChange={() => {
                      dispatch({
                        type: 'USERS_CARD_VIEW',
                        payload: !usersCardView,
                      });
                      setCookies('usersCardView', !usersCardView);
                    }}
                    value={t('tableview')}
                    inputProps={{ 'aria-label': 'checkbox' }}
                  />
                </Grid>
                <Grid item>{t('cardview')}</Grid>
              </Grid>
              <Grid container className={classes.toolbarText}>
                {
                  // Show only on cardView
                  usersCardView && (
                    <TextField
                      variant='standard'
                      value={searchText}
                      onChange={(event) => requestSearch(event.target.value)}
                      placeholder={`${t('search')}`}
                      fullWidth
                      sx={{
                        m: (theme) => theme.spacing(1, 0.5, 1.5),
                        '& .MuiSvgIcon-root': {
                          mr: 0.5,
                        },
                        '& .MuiInput-underline:before': {
                          borderBottom: 1,
                          borderColor: 'divider',
                        },
                      }}
                      InputProps={{
                        startAdornment: <SearchIcon fontSize='small' />,
                        endAdornment: (
                          <IconButton
                            title={`${t('clear')}`}
                            aria-label='Clear'
                            size='small'
                            style={{
                              visibility: searchText ? 'visible' : 'hidden',
                            }}
                            onClick={() => {
                              requestSearch('');
                            }}>
                            <ClearIcon fontSize='small' />
                          </IconButton>
                        ),
                      }}
                    />
                  )
                }
              </Grid>
              <Grid container className={classes.Icon}>
                {
                  // Show only on cardView
                  usersCardView && (
                    <Fragment>
                      <Tooltip title={t('perPage')} arrow placement='bottom'>
                        <IconButton
                          disableRipple
                          disableFocusRipple
                          onClick={(e) => {
                            setAnchorPEl(e.currentTarget);
                          }}>
                          <FilterListIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        elevation={18}
                        disableScrollLock
                        id={perPageId}
                        open={openPerPage}
                        anchorEl={anchorPEl}
                        onClose={() => {
                          setAnchorPEl(null);
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}>
                        <List
                          sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                            borderRadius: 2,
                            p: 2,
                            minWidth: 220,
                          }}
                          component='nav'
                          aria-label='Page-menu'>
                          {[6, 12, 24, 48, 96].map((list, index) => {
                            const text =
                              list == 6
                                ? t('Six')
                                : list == 12
                                ? t('Twelve')
                                : list == 24
                                ? t('Twentyfour')
                                : list == 48
                                ? t('Fourtyeight')
                                : t('Nightysix');
                            return (
                              <Fragment key={index}>
                                <ListItem
                                  disablePadding
                                  onClick={() => {
                                    //Change the number of page if current page number is higher that total page
                                    if (
                                      Math.ceil(totalUsers / list) <
                                      usersPageNumber
                                    ) {
                                      dispatch({
                                        type: 'USERS_PAGE_NUMBER',
                                        payload: 1,
                                      });
                                      setCookies('usersPageNumber', 1);
                                    }
                                    dispatch({
                                      type: 'USERS_PER_PAGE',
                                      payload: list,
                                    });
                                    localStorage.setItem('usersPerPage', list);
                                    setCookies('usersPerPage', list);
                                    setAnchorPEl(null);
                                  }}>
                                  <ListItemButton>
                                    <ListItemIcon>
                                      {list == usersPerPage && (
                                        <CheckIcon color='primary' />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`${text} per page`}
                                    />
                                  </ListItemButton>
                                </ListItem>
                                {index !== 4 && <Divider />}
                              </Fragment>
                            );
                          })}
                        </List>
                      </Popover>
                      <Tooltip title={t('perRow')} arrow placement='bottom'>
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                          }}>
                          <ViewColumnIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        elevation={18}
                        disableScrollLock
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={() => {
                          setAnchorEl(null);
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}>
                        <List
                          sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                            borderRadius: 2,
                            p: 2,
                            minWidth: 220,
                          }}
                          component='nav'
                          aria-label='Rows-menu'>
                          {[2, 3, 4, 6, 12].map((list, index) => {
                            const text =
                              list == 2
                                ? t('Six')
                                : list == 3
                                ? t('Four')
                                : list == 4
                                ? t('Three')
                                : list == 6
                                ? t('Two')
                                : t('One');
                            return (
                              <Fragment key={index}>
                                <ListItem
                                  disablePadding
                                  onClick={() => {
                                    dispatch({
                                      type: 'USERS_GRID',
                                      payload: list,
                                    });
                                    localStorage.setItem('usersGrid', list);
                                    setAnchorEl(null);
                                  }}>
                                  <ListItemButton>
                                    <ListItemIcon>
                                      {list == usersGrid && (
                                        <CheckIcon color='primary' />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                  </ListItemButton>
                                </ListItem>
                                {index !== 4 && <Divider />}
                              </Fragment>
                            );
                          })}
                        </List>
                      </Popover>
                      <Tooltip title={t('sortBy')} arrow placement='bottom'>
                        <IconButton
                          disableRipple
                          disableFocusRipple
                          onClick={(e) => {
                            setAnchorSEl(e.currentTarget);
                          }}>
                          <Sort fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={sortPageId}
                        open={openSortPage}
                        anchorEl={anchorSEl}
                        onClose={() => {
                          setAnchorSEl(null);
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}>
                        <List
                          sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                            borderRadius: 2,
                            p: 2,
                            minWidth: 220,
                          }}
                          component='nav'
                          aria-label='Page-menu'>
                          {userFields.map((fields, index) => {
                            return (
                              <Fragment key={index}>
                                <ListItem
                                  disablePadding
                                  sx={{
                                    '&:hover, &:focus': {
                                      bgcolor: 'unset',

                                      '& svg:last-of-type': {
                                        right: 0,
                                        opacity: 1,
                                      },
                                    },
                                  }}
                                  onClick={() => {}}>
                                  <ListItemButton
                                    onClick={(e) => {
                                      setAnchorSTl((prev) => ({
                                        0: e.currentTarget,
                                        filed: fields.label,
                                      }));
                                    }}>
                                    <ListItemIcon>
                                      <Tooltip title='Account settings'>
                                        <IconButton
                                          size='large'
                                          disableFocusRipple
                                          disableRipple>
                                          {rtlActive ? (
                                            <ArrowRight
                                              sx={{
                                                position: 'absolute',
                                                left: 10,
                                                opacity: 0,
                                              }}
                                            />
                                          ) : (
                                            <ArrowLeft
                                              sx={{
                                                position: 'absolute',
                                                left: -10,
                                                opacity: 0,
                                              }}
                                            />
                                          )}
                                        </IconButton>
                                      </Tooltip>
                                      {fields.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={`${fields.label}`} />
                                  </ListItemButton>
                                </ListItem>
                              </Fragment>
                            );
                          })}
                        </List>
                      </Popover>
                      {anchorSTl[0] !== null && (
                        <Popover
                          elevation={18}
                          id={sortPageId}
                          open={openSortType}
                          anchorEl={anchorSTl[0]}
                          onClose={(e) => {
                            setAnchorSTl((prev) => ({
                              0: null,
                            }));
                          }}
                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 52,
                            horizontal: rtlActive ? -205 : 235,
                          }}>
                          <List
                            sx={{
                              bgcolor: 'background.paper',
                              boxShadow: 1,
                              borderRadius: 2,
                              p: 2,
                              minWidth: 220,
                              maxWidth: 220,
                              overflow: 'visible',
                              '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 52,
                                right: rtlActive ? 214 : -4,
                                width: 10,
                                height: 10,
                                bgcolor: theme.palette.primary.main,
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            }}
                            dense
                            disablePadding
                            component='nav'
                            aria-label='menu'>
                            {['ASC', 'DESC'].map((list, index) => {
                              return (
                                <Fragment key={index}>
                                  <ListItem
                                    disablePadding
                                    onClick={() => {
                                      dispatch({
                                        type: 'USERS_SORT_BY',
                                        payload: {
                                          field: anchorSTl[`filed`],
                                          sorting: list == 'ASC' ? 1 : -1,
                                        },
                                      });
                                      setCookies('usersSortBy', {
                                        field: anchorSTl[`filed`],
                                        sorting: list == 'ASC' ? 1 : -1,
                                      });
                                      setAnchorSEl(null);
                                      setAnchorSTl({
                                        0: null,
                                      });
                                    }}>
                                    <ListItemButton>
                                      <ListItemIcon>
                                        <CheckIcon color='primary' />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={`${list} ${
                                          anchorSTl[`filed`]
                                        }`}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                  {index !== 1 && <Divider />}
                                </Fragment>
                              );
                            })}
                          </List>
                        </Popover>
                      )}
                      <Tooltip title={t('createNew')} arrow placement='bottom'>
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          onClick={(e) => {
                            e.preventDefault();
                            history.push({
                              pathname: '/admin/dashboard/user-page/user',
                            });
                          }}>
                          <AddIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Fragment>
                  )
                }
              </Grid>
            </Grid>
          </StyledBox>
          <UserBox maxWidth='xl'>
            {usersCardView ? (
              <Fragment>
                <Grid
                  container
                  spacing={1}
                  direction='column'
                  justifyContent='center'
                  alignItems='center'
                  sx={{ pb: 2, pt: 2 }}>
                  <Grid item>
                    <Typography>Page: {usersPageNumber}</Typography>
                  </Grid>
                  <Grid item>
                    <Pagination
                      count={Math.ceil(totalUsers / usersPerPage)}
                      page={usersPageNumber}
                      showLastButton
                      showFirstButton
                      boundaryCount={2}
                      color='primary'
                      onChange={(e, value) => {
                        setExpanded({})
                        dispatch({ type: 'USERS_PAGE_NUMBER', payload: value });
                        setCookies('usersPageNumber', value);
                      }}
                      siblingCount={1}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                  {users.map((user, index) => {
                    return (
                      <Grid
                        item
                        xs={usersGrid}
                        sm={usersGrid}
                        md={usersGrid}
                        lg={usersGrid}
                        xl={usersGrid}
                        key={index}>
                        <Card
                          style={{
                            opacity:
                              Object.keys(expanded).length === 0 &&
                              Object.keys(expanded)[0] == undefined
                                ? 1
                                : expanded[index] == true
                                ? 1
                                : Object.values(expanded)[0] == undefined ||
                                  !Object.values(expanded)[0]
                                ? 1
                                : 0.2,
                          }}
                          profile
                          className={classes.cardHover}
                          ref={elRefs[index]}>
                          <CardHeader
                            icon
                            color='rose'
                            className={classes.cardHeaderHover}>
                            <Badge
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                              color='secondary'
                              variant='dot'
                              badgeContent=' '
                              invisible={user._id !== profile._id}>
                              <CardAvatar profile>
                                <img
                                  src={user.profileImage || avatar.src}
                                  alt='...'
                                />
                              </CardAvatar>
                            </Badge>
                          </CardHeader>
                          <CardBody>
                            <div className={classes.cardHoverUnder}>
                              <Tooltip
                                id='tooltip-top'
                                title={t('3rdRow').tooltip_0}
                                placement='bottom'
                                classes={{ tooltip: classes.tooltip }}>
                                <Button
                                  color='primary'
                                  onClick={() => {
                                    history.push({
                                      pathname: '/admin/dashboard/user-page',
                                      search: `?_id=${user._id}`,
                                    });
                                  }}>
                                  <ArtTrackIcon
                                    className={classes.underChartIcons}
                                  />
                                </Button>
                              </Tooltip>
                              {user._id !== profile._id && (
                                <Tooltip
                                  id='tooltip-top'
                                  title={t('3rdRow').tooltip_2}
                                  placement='bottom'
                                  classes={{ tooltip: classes.tooltip }}>
                                  <Button
                                    color='error'
                                    onClick={() => {
                                      sweetAlert(user);
                                    }}>
                                    <DeleteForeverOutlined
                                      className={classes.underChartIcons}
                                    />
                                  </Button>
                                </Tooltip>
                              )}
                            </div>
                            <span
                              style={{
                                display: 'flex',
                                flexDirection: rtlActive
                                  ? 'row-reverse'
                                  : 'row',
                              }}>
                              <h4 className={classes.cardProductTitle}>
                                <Tooltip
                                  title={user.userName}
                                  placement='top'
                                  arrow>
                                  <a
                                    href='#'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      history.push({
                                        pathname: '/admin/dashboard/user-page',
                                        search: `?_id=${user._id}`,
                                      });
                                    }}>
                                    {user.userName.length < stringLimit
                                      ? user.userName
                                      : rtlActive
                                      ? `... ${user.userName.slice(
                                          0,
                                          stringLimit
                                        )}`
                                      : `${user.userName.slice(
                                          0,
                                          stringLimit
                                        )} ...`}
                                  </a>
                                </Tooltip>
                              </h4>
                            </span>
                            <Divider />
                            <Tooltip
                              title={expanded[index] ? '' : t('expand')}
                              placement='top'
                              arrow>
                              <Box
                                sx={{
                                  bgcolor: theme.palette.background.paper,
                                  borderRadius: `0px 0px 12px 12px`,
                                  pb: expanded[index] ? 2 : 0,
                                  position: expanded[index]
                                    ? 'absolute'
                                    : 'relative',
                                  right: 0,
                                  left: 0,
                                  zIndex: expanded[index] ? 4 : 1,
                                }}>
                                <ListItemButton
                                  alignItems='flex-start'
                                  onClick={() => {
                                    setExpanded(() => ({
                                      [`${index}`]: !expanded[index],
                                    }));
                                  }}
                                  sx={{
                                    px: 3,
                                    pt: 2.5,
                                    pb: expanded[index] ? 0 : 2.5,
                                    '&:hover, &:focus': {
                                      '& svg': {
                                        opacity: expanded[index] ? 1 : 0,
                                      },
                                    },
                                  }}>
                                  <ListItemText
                                    primary={t('information')}
                                    primaryTypographyProps={{
                                      fontSize: 15,
                                      fontWeight: 'medium',
                                      lineHeight: '20px',
                                      mb: '2px',
                                      color: theme.palette.text.color,
                                    }}
                                    secondary={userFields
                                      .map((e) => e.label)
                                      .join(', ')}
                                    secondaryTypographyProps={{
                                      noWrap: true,
                                      fontSize: 12,
                                      lineHeight: '16px',
                                      color: theme.palette.text.color,
                                    }}
                                    sx={{ my: 0 }}
                                  />
                                  <KeyboardArrowDown
                                    sx={{
                                      mr: -1,
                                      opacity: 0,
                                      transform: expanded[index]
                                        ? 'rotate(-180deg)'
                                        : 'rotate(0)',
                                      transition: '0.2s',
                                      color: theme.palette.text.color,
                                    }}
                                  />
                                </ListItemButton>
                                {expanded[index] && (
                                  <ClickAwayListener
                                    onClickAway={() => {
                                      if (expanded[index]) {
                                        setExpanded(() => ({
                                          [`${index}`]: !expanded[index],
                                        }));
                                      }
                                    }}>
                                    <span>
                                      {expanded[index] &&
                                        expanded[index] &&
                                        userFields.map((item) => {
                                          return (
                                            <ListItemButton
                                              key={item.label}
                                              sx={{
                                                py: 0,
                                                minHeight: 32,
                                                color: theme.palette.text.color,
                                              }}>
                                              <Tooltip
                                                title={t(`${item.label}`)}
                                                arrow
                                                placement='top'>
                                                <ListItemIcon
                                                  sx={{ color: 'inherit' }}
                                                  onClick={() => {
                                                    history.push({
                                                      pathname:
                                                        '/admin/dashboard/user-page',
                                                      search: `?_id=${user._id}`,
                                                    });
                                                  }}>
                                                  {item.icon}
                                                </ListItemIcon>
                                              </Tooltip>
                                              <ListItemText
                                                onClick={() => {
                                                  history.push({
                                                    pathname:
                                                      '/admin/dashboard/user-page',
                                                    search: `?_id=${user._id}`,
                                                  });
                                                }}
                                                primary={
                                                  typeof user[item.label] !==
                                                  'boolean' ? (
                                                    user[item.label] == '' ? (
                                                      `${t('notDefine')}`
                                                    ) : moment(
                                                        user[item.label],
                                                        moment.ISO_8601,
                                                        true
                                                      ).isValid() ? (
                                                      moment(
                                                        user[item.label]
                                                      ).format(
                                                        'MMMM Do YYYY, H:mm'
                                                      )
                                                    ) : user[item.label].length <
                                                      stringLimit ? (
                                                      user[item.label]
                                                    ) : rtlActive ? (
                                                      `... ${user[
                                                        item.label
                                                      ].slice(0, stringLimit)}`
                                                    ) : (
                                                      `${user[item.label].slice(
                                                        0,
                                                        stringLimit
                                                      )} ...`
                                                    )
                                                  ) : user[item.label] ? (
                                                    <DoneIcon
                                                      style={{
                                                        color:
                                                          theme.palette.success
                                                            .main,
                                                      }}
                                                    />
                                                  ) : (
                                                    <CloseIcon
                                                      style={{
                                                        color:
                                                          theme.palette.error
                                                            .main,
                                                      }}
                                                    />
                                                  )
                                                }
                                                primaryTypographyProps={{
                                                  fontSize: 14,
                                                  fontWeight: 'medium',
                                                }}
                                              />
                                            </ListItemButton>
                                          );
                                        })}
                                    </span>
                                  </ClickAwayListener>
                                )}
                              </Box>
                            </Tooltip>
                          </CardBody>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid
                  container
                  spacing={1}
                  direction='column'
                  justifyContent='center'
                  alignItems='center'
                  sx={{ pb: 2 }}>
                  <Grid item>
                    <Typography>Page: {usersPageNumber}</Typography>
                  </Grid>
                  <Grid item>
                    <Pagination
                      count={Math.ceil(totalUsers / usersPerPage)}
                      page={usersPageNumber}
                      showLastButton
                      showFirstButton
                      boundaryCount={2}
                      color='primary'
                      onChange={(e, value) => {
                        setExpanded({})
                        dispatch({ type: 'USERS_PAGE_NUMBER', payload: value });
                        setCookies('usersPageNumber', value);
                      }}
                      siblingCount={1}
                    />
                  </Grid>
                </Grid>
              </Fragment>
            ) : (
              'tableView'
            )}
          </UserBox>
        </Fragment>
      )}
    </Container>
  );
}
