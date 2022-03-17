import footerStyle from './footer-style';

import PropTypes from 'prop-types';
import cx from 'classnames';

import { List, ListItem } from '@mui/material';
import { withTranslation, useTranslation } from 'react-i18next';
  

export default function Footer(props) {
  const classes = footerStyle();
  const { fluid, white } = props;
  const { t, ready, i18n } = useTranslation('footer');
  const rtlActive = i18n.language == 'fa';
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  });
  var anchor =
    classes.a +
    cx({
      [' ' + classes.whiteColor]: white,
    });
  var block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white,
  });

  return (
    <footer className={classes.footer}>
      <div >
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href={process.env.NEXT_PUBLIC_HOME_VERCEL}
                className={classes.a}
                target='_blank'>
                {t("list")}
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{' '}
          <a
            href="https://nastaransamui.github.io/"
            className={classes.a}
            target='_blank'>
            {t("creator")}
          </a>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
};
