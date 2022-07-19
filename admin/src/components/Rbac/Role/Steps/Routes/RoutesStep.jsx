import { useState, useEffect } from 'react';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import routes from '../../../../../../routes';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const RoutesStep = (props) => {
  const { values, handleAddRoutes, handleRemoveRoutes, role_id,routeValidate } = props;
  var copyRoute = JSON.parse(JSON.stringify(routes));
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(
    copyRoute.slice(1).filter((val) => !values.routes.includes(val))
  );
  const theme = useTheme();
  const [right, setRight] = useState(values.routes);
  const { t, i18n } = useTranslation('roles');
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    handleAddRoutes(right.concat(leftChecked));
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    handleRemoveRoutes(not(right, rightChecked));
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    let isMount = true;
    if (isMount && role_id !== undefined) {
      setRight(values.routes);
      const notIncluded = copyRoute.filter((a) => {
        if (
          !values.routes
            .map((a) => a[`name_${i18n.language}`])
            .includes(a[`name_${i18n.language}`])
        ) {
          return a;
        }
      });
      setLeft(
        notIncluded.slice(1).filter((val) => !values.routes.includes(val))
      );
    }
    return () => {
      isMount = false;
    };
  }, [values]);

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} ${t('selected')}`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.default',
          overflow: 'auto',
        }}
        dense
        component='div'
        role='list'>
        {items.map((value, i) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={i}
              role='listitem'
              button
              onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value[`name_${i18n.language}`]}`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <Grid item>{customList(t('routes'), left)}</Grid>
      <Grid item>
        <Grid container direction='column' alignItems='center'>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            style={{ border: `solid 1px ${theme.palette.secondary.main}` }}
            size='small'
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label='move selected right'>
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            style={{ border: `solid 1px ${theme.palette.secondary.main}` }}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label='move selected left'>
            &lt;
          </Button>

          {routeValidate && (
            <Typography
              variant='caption'
              color={theme.palette.error.main}
              style={{ width: 90 }}>
              {t('routesEmpty')}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item>{customList(t('access'), right)} </Grid>
    </Grid>
  );
};

export default RoutesStep;
