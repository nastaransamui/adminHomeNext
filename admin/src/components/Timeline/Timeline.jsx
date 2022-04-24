import timelineStyle from './timeline-style';

import cx from 'classnames';
import PropTypes from 'prop-types';
import Badge from '../Badge/Badge';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';

export default function Timeline(props) {
  const classes = timelineStyle();
  const { i18n } = useTranslation();
  const rtlActive = i18n.language == 'fa';

  const { stories, simple } = props;
  const timelineClass =
    classes.timeline +
    ' ' +
    cx({
      [classes.timelineSimple]: simple,
    });
  return (
    <ul className={timelineClass}>
      {stories.map((prop, key) => {
        const panelClasses =
          classes.timelinePanel +
          ' ' +
          cx({
            [classes.timelinePanelInverted]: prop.inverted || simple,
            [classes.timelineSimplePanel]: simple,
          });
        const timelineBadgeClasses =
          classes.timelineBadge +
          ' ' +
          classes[prop.badgeColor] +
          ' ' +
          cx({
            [classes.timelineSimpleBadge]: simple,
          });
        return (
          <li className={classes.item} key={key}>
            {prop.badgeIcon ? (
              <Tooltip title={prop.badgeTooltip} arrow>
              <div className={timelineBadgeClasses}>
                <prop.badgeIcon className={classes.badgeIcon} />
              </div>
              </Tooltip>
            ) : null}
            <div className={panelClasses}>
              {prop.title ? (
                <div
                  className={
                    prop.inverted
                      ? rtlActive
                        ? classes.timelineHeadingInvert
                        : classes.timelineHeading
                      : rtlActive
                      ? classes.timelineHeading
                      : classes.timelineHeadingInvert
                  }>
                  <Badge color={prop.titleColor}>{prop.title}</Badge>
                </div>
              ) : null}
              <div className={classes.timelineBody}>{prop.body}</div>
              {prop.footerTitle ? (
                <h6 className={classes.footerTitle}>{prop.footerTitle}</h6>
              ) : null}
              {prop.footer ? <hr className={classes.footerLine} /> : null}
              {prop.footer ? (
                <div className={classes.timelineFooter}>{prop.footer}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

Timeline.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.object).isRequired,
  simple: PropTypes.bool,
};
