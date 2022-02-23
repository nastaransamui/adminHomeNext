import brand from '../../../public/text/brand';
import brandStyles from './brand-style';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default function BrandLogo({
  rtlActive,
  stateMiniActive,
  propsMiniActive,
  bgColor,
  i18n
}) {
  const classes = brandStyles();
  const logoClasses =
    classes.logo +
    ' ' +
    cx({
      [classes.whiteAfter]: bgColor === 'white',
    });
  const logoMini =
    classes.logoMini +
    ' ' +
    cx({
      [classes.logoMiniRTL]: rtlActive,
    });
  const logoNormal =
    classes.logoNormal +
    ' ' +
    cx({
      [classes.logoNormalSidebarMini]: !propsMiniActive && stateMiniActive,
      [classes.logoNormalSidebarMiniRTL]:
        rtlActive && !propsMiniActive && stateMiniActive,
      [classes.logoNormalRTL]: rtlActive,
    });
  return (
    <div className={logoClasses}>
      <span style={{ cursor: 'pointer' }} className={logoMini}>
        <img src='/admin/images/logo.png' alt='logo' className={classes.img} />
      </span>
      <span
        style={{ cursor: 'pointer', lineHeight: `40px` }}
        className={logoNormal}>
        {brand[`name_${i18n.language}`]}
      </span>
    </div>
  );
}

BrandLogo.propTypes = {
  rtlActive: PropTypes.bool.isRequired,
  stateMiniActive: PropTypes.bool.isRequired,
  propsMiniActive: PropTypes.bool.isRequired,
  bgColor: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};
