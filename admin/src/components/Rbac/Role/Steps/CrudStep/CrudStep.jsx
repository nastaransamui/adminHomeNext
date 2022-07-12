import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import Checkbox from '@mui/material/Checkbox';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import alertCall from '../../../../Hooks/useAlert';
import { checkCookies } from 'cookies-next';

function MinusSquare(props) {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
    </SvgIcon>
  );
}

const CustomContent = forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;
  const handleMouseDown = (event) => {};

  const handleExpansionClick = (event) => {
    if (icon.props.checked == undefined) {
      handleExpansion(event);
    } else {
      handleSelection(event);
    }
  };

  const handleSelectionClick = (event) => {
    handleExpansion(event);
  };
  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component='div'
        className={classes.label}>
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
);

const CrudStep = (props) => {
  const { values, setValues } = props;
  const { t, i18n } = useTranslation('roles');
  const router = useRouter();
  const theme = useTheme();
  const selectClicked = (e, id) => {
    var crud = ['delete', 'create', 'update', 'read'];
    const idsArray = id.split('_');
    var isCrudClicked = false;
    for (var i = 0, ln = crud.length; i < ln; i++) {
      if (id.indexOf(crud[i]) !== -1) {
        isCrudClicked = true;
        break;
      }
    }

    switch (idsArray.length) {
      case 4:
        var copyOfValue = JSON.parse(
          JSON.stringify(values.routes[idsArray[1]]?.views[[idsArray[3]]])
        );
        let cruds = [...copyOfValue.crud];
        let readStatus =
          cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
        if (copyOfValue?.views?.length > 0) {
          if (readStatus) {
            copyOfValue.crud.map((a) => (a.active = false));
            copyOfValue.views.map((c) => c.crud.map((d) => (d.active = false)));
          } else {
            copyOfValue.crud.map((a) => (a.active = true));
            copyOfValue.views.map((c) => c.crud.map((d) => (d.active = true)));
          }
        } else {
          if (readStatus) {
            copyOfValue.crud.map((a) => (a.active = false));
          } else {
            copyOfValue.crud.map((a) => (a.active = true));
          }
        }
        Object.assign(
          values.routes[idsArray[1]]?.views[[idsArray[3]]],
          copyOfValue
        );
        setValues((oldValues) => ({ ...oldValues }));
        break;
      case 6:
        if (isCrudClicked) {
          var copyOfValue = JSON.parse(
            JSON.stringify(values.routes[idsArray[1]]?.views[[idsArray[3]]])
          );
          let cruds = [...copyOfValue.crud];
          let readStatus =
            cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
          if (readStatus) {
            if (idsArray[4] == 'read') {
              copyOfValue.crud.map((c) => (c.active = false));
            } else {
              copyOfValue.crud.map((c) => {
                if (c.name == idsArray[4]) {
                  c.active = !c.active;
                }
                return c;
              });
            }
          } else {
            if (idsArray[4] == 'read') {
              copyOfValue.crud.map((c) => (c.active = true));
            } else {
              if (readStatus) {
                copyOfValue.crud.map((c) => {
                  if (c.name == idsArray[4]) {
                    c.active = !c.active;
                  }
                  return c;
                });
              } else {
                alertCall(theme, 'error', t('firstRead'), () => {
                  if (!checkCookies('adminAccessToken')) {
                    router.push('/', undefined, { shallow: true });
                  }
                });
              }
            }
          }
          Object.assign(
            values.routes[idsArray[1]]?.views[[idsArray[3]]],
            copyOfValue
          );
          setValues((oldValues) => ({ ...oldValues }));
        } else {
          var copyOfParentsValue =
            values.routes[idsArray[1]]?.views[[idsArray[3]]];
          let parentsCruds = [...copyOfParentsValue.crud];
          let parentsReadStatus =
            parentsCruds[parentsCruds.findIndex((obj) => obj.name == 'read')]
              .active;
          var copyOfValue = JSON.parse(
            JSON.stringify(
              values.routes[idsArray[1]]?.views[[idsArray[3]]]?.views[
                [idsArray[5]]
              ]
            )
          );
          let cruds = [...copyOfValue.crud];
          let readStatus =
            cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
          if (copyOfValue?.views?.length > 0) {
            if (readStatus) {
              copyOfValue.crud.map((a) => (a.active = false));
              copyOfValue.views.map((c) =>
                c.crud.map((d) => (d.active = false))
              );
            } else {
              copyOfValue.crud.map((a) => (a.active = true));
              copyOfValue.views.map((c) =>
                c.crud.map((d) => (d.active = true))
              );
            }
          } else {
            if (readStatus) {
              copyOfValue.crud.map((a) => (a.active = false));
            } else {
              if (!parentsReadStatus)
                copyOfParentsValue.crud.map((a) => (a.active = true));
              copyOfValue.crud.map((a) => (a.active = true));
            }
          }
          Object.assign(
            values.routes[idsArray[1]]?.views[[idsArray[3]]]?.views[
              [idsArray[5]]
            ],
            copyOfValue
          );
          Object.assign(
            values.routes[idsArray[1]]?.views[[idsArray[3]]],
            copyOfParentsValue
          );
          setValues((oldValues) => ({ ...oldValues }));
        }
        break;
      case 8:
        if (isCrudClicked) {
          var copyOfValue = JSON.parse(
            JSON.stringify(
              values.routes[idsArray[1]]?.views[[idsArray[3]]]?.views[
                [idsArray[5]]
              ]
            )
          );
          var copyOfParentsValue =
            values.routes[idsArray[1]]?.views[[idsArray[3]]];
          let parentsCruds = [...copyOfParentsValue.crud];
          let parentsReadStatus =
            parentsCruds[parentsCruds.findIndex((obj) => obj.name == 'read')]
              .active;
          let cruds = [...copyOfValue.crud];
          let readStatus =
            cruds[cruds.findIndex((obj) => obj.name == 'read')].active;
          if (readStatus) {
            if (idsArray[6] == 'read') {
              copyOfValue.crud.map((c) => (c.active = false));
            } else {
              copyOfValue.crud.map((c) => {
                if (c.name == idsArray[6]) {
                  c.active = !c.active;
                }
                return c;
              });
            }
          } else {
            if (idsArray[6] == 'read') {
              copyOfValue.crud.map((c) => (c.active = true));
              if (!parentsReadStatus)
                copyOfParentsValue.crud.map((a) => (a.active = true));
            } else {
              if (readStatus) {
                copyOfValue.crud.map((c) => {
                  if (c.name == idsArray[6]) {
                    c.active = !c.active;
                  }
                  return c;
                });
              } else {
                alertCall(theme, 'error', t('firstRead'), () => {
                  if (!checkCookies('adminAccessToken')) {
                    router.push('/', undefined, { shallow: true });
                  }
                });
              }
            }
          }
          Object.assign(
            values.routes[idsArray[1]]?.views[[idsArray[3]]]?.views[
              [idsArray[5]]
            ],
            copyOfValue
          );
          Object.assign(
            values.routes[idsArray[1]]?.views[[idsArray[3]]],
            copyOfParentsValue
          );
          setValues((oldValues) => ({ ...oldValues }));
        } else {
          /**If depth of routes grow */
        }
        break;
    }
  };
  return (
    <Grid container justifyContent='center'>
      <TreeView
        aria-label='customized'
        defaultExpanded={['0']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
        <CustomTreeItem nodeId='0' label={t('dashboard')}>
          <TreeView
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            onNodeSelect={(e, id) => {
              selectClicked(e, id);
            }}
            defaultEndIcon={
              <Checkbox
                checked={true}
                color='secondary'
                tabIndex={-1}
                disableRipple
                inputProps={{
                  'aria-labelledby': 'labelId',
                }}
              />
            }>
            {values.routes.map((route, index) => {
              if (route?.views && route.views.length > 0) {
                return (
                  <CustomTreeItem
                    nodeId={`${route[`name_${i18n.language}`]}`}
                    label={`${route[`name_${i18n.language}`]}`}
                    key={`${route[`name_${i18n.language}`]}`}>
                    {route?.views.map((firstView, i) => {
                      if (firstView?.views?.length > 0) {
                        return (
                          <CustomTreeItem
                            nodeId={`${
                              route[`name_${i18n.language}`]
                            }_${index}_${
                              firstView[`name_${i18n.language}`]
                            }_${i}`}
                            label={`${firstView[`name_${i18n.language}`]}`}
                            key={`${firstView[`name_${i18n.language}`]}`}
                            icon={
                              <Checkbox
                                checked={
                                  firstView.crud.filter(
                                    (a) => a.name == 'read'
                                  )[0].active
                                }
                                color='secondary'
                                tabIndex={-1}
                                inputProps={{
                                  'aria-labelledby': `labelId_${
                                    firstView[`name_${i18n.language}`]
                                  }`,
                                }}
                              />
                            }>
                            {firstView.views.map((v, k) => {
                              if (v.collapse) {
                                // third collapse
                              } else {
                                return (
                                  <CustomTreeItem
                                    nodeId={`${
                                      route[`name_${i18n.language}`]
                                    }_${index}_${
                                      firstView[`name_${i18n.language}`]
                                    }_${i}_${v[`name_${i18n.language}`]}_${k}`}
                                    label={`${v[`name_${i18n.language}`]}`}
                                    key={`${v[`name_${i18n.language}`]}`}
                                    icon={
                                      <Checkbox
                                        checked={
                                          v.crud.filter(
                                            (a) => a.name == 'read'
                                          )[0].active
                                        }
                                        color='secondary'
                                        tabIndex={-1}
                                        inputProps={{
                                          'aria-labelledby': `labelId_${
                                            v[`name_${i18n.language}`]
                                          }`,
                                        }}
                                      />
                                    }>
                                    {v.crud.map((child, j) => {
                                      return (
                                        <CustomTreeItem
                                          key={child.name}
                                          label={t(`${child.name}`)}
                                          nodeId={`${
                                            route[`name_${i18n.language}`]
                                          }_${index}_${
                                            firstView[`name_${i18n.language}`]
                                          }_${i}_${
                                            v[`name_${i18n.language}`]
                                          }_${k}_${child.name}_${j}`}
                                          icon={
                                            <Checkbox
                                              checked={
                                                v.crud.filter(
                                                  (a) => a.name == child.name
                                                )[0].active
                                              }
                                              color='secondary'
                                              // disabled={child.name == 'read'}r
                                              tabIndex={-1}
                                              disableRipple
                                              inputProps={{
                                                'aria-labelledby': `labelId_${
                                                  route[`name_${i18n.language}`]
                                                }_${index}_${
                                                  firstView[
                                                    `name_${i18n.language}`
                                                  ]
                                                }_${j}_${child.name}_${j}`,
                                              }}
                                            />
                                          }
                                        />
                                      );
                                    })}
                                  </CustomTreeItem>
                                );
                              }
                            })}
                          </CustomTreeItem>
                        );
                      } else {
                        return (
                          <CustomTreeItem
                            nodeId={`${
                              route[`name_${i18n.language}`]
                            }_${index}_${
                              firstView[`name_${i18n.language}`]
                            }_${i}`}
                            label={`${firstView[`name_${i18n.language}`]}`}
                            key={`${firstView[`name_${i18n.language}`]}`}
                            icon={
                              <Checkbox
                                checked={
                                  firstView.crud.filter(
                                    (a) => a.name == 'read'
                                  )[0].active
                                }
                                color='secondary'
                                tabIndex={-1}
                                inputProps={{
                                  'aria-labelledby': `labelId_${
                                    firstView[`name_${i18n.language}`]
                                  }`,
                                }}
                              />
                            }>
                            {firstView.crud.map((child, j) => {
                              return (
                                <CustomTreeItem
                                  key={child.name}
                                  label={t(`${child.name}`)}
                                  nodeId={`${
                                    route[`name_${i18n.language}`]
                                  }_${index}_${
                                    firstView[`name_${i18n.language}`]
                                  }_${i}_${child.name}_${j}`}
                                  icon={
                                    <Checkbox
                                      checked={
                                        firstView.crud.filter(
                                          (a) => a.name == child.name
                                        )[0].active
                                      }
                                      color='primary'
                                      // disabled={child.name == 'read'}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        'aria-labelledby': `labelId_${
                                          route[`name_${i18n.language}`]
                                        }_${index}_${
                                          firstView[`name_${i18n.language}`]
                                        }_$j_${child.name}_${j}`,
                                      }}
                                    />
                                  }
                                />
                              );
                            })}
                          </CustomTreeItem>
                        );
                      }
                    })}
                  </CustomTreeItem>
                );
              } else {
                return (
                  <CustomTreeItem
                    nodeId={`${route[`name_${i18n.language}`]}`}
                    label={`${route[`name_${i18n.language}`]}`}
                    key={`${route[`name_${i18n.language}`]}`}
                  />
                );
              }
            })}
          </TreeView>
        </CustomTreeItem>
      </TreeView>
    </Grid>
  );
};

export default CrudStep;
