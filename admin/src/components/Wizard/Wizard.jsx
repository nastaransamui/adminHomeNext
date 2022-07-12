import { createRef, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '../Card/Card';
import wizardStyle from './wizard-style';

const Wizard = (props) => {
  const {
    title,
    subtitle,
    previousButtonClasses,
    steps,
    previousButtonText,
    nextButtonText,
    finishButtonClasses,
    finishButtonText,
    nextButtonClasses,
    finishButtonClick,
    rtlActive,
  } = props;
  const { createButtonDisabled, updateButtonDisabled, role_id } = steps[0];

  const classes = wizardStyle();
  const wizard = useRef();
  const [width, setWidth] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [nextButton, setNextButton] = useState(steps.length > 1 ? true : false);
  const [previousButton, setPreviousButton] = useState(false);
  const [finishButton, setFinishButton] = useState(
    steps.length === 1 ? true : false
  );
  const [movingTabStyle, setMovingTabStyle] = useState({
    transition: 'transform 0s',
  });
  const [allState, setAllState] = useState({});

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      if (steps.length === 1) {
        setWidth('100%');
      } else {
        if (window.innerWidth < 600) {
          if (steps.length !== 3) {
            setWidth('50%');
          } else {
            setWidth(100 / 3 + '%');
          }
        } else {
          if (steps.length === 2) {
            setWidth('50%');
          } else {
            setWidth(100 / 3 + '%');
          }
        }
      }
      refreshAnimation(0);
      window.addEventListener('resize', updateWidth);
    }
    return () => {
      isMount = false;
      window.removeEventListener('resize', updateWidth);
    };
  }, [rtlActive]);

  const updateWidth = () => {
    refreshAnimation(currentStep);
  };

  const refreshAnimation = (index) => {
    var total = steps.length;
    let li_width = 100 / total;
    var total_steps = steps.length;
    var move_distance = wizard.current.children[0].offsetWidth / total_steps;
    let index_temp = index;
    let vertical_level = 0;

    var mobile_device = window.innerWidth < 600 && total > 3;
    if (mobile_device) {
      move_distance = wizard.current.children[0].offsetWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }
    setWidth(li_width + '%');
    var step_width = move_distance;
    move_distance = rtlActive
      ? -move_distance * index_temp
      : move_distance * index_temp;

    var current = index + 1;
    if (current === 1 || (mobile_device === true && index % 2 === 0)) {
      move_distance = rtlActive ? move_distance + 8 : move_distance - 8;
    } else if (
      current === total_steps ||
      (mobile_device === true && index % 2 === 1)
    ) {
      move_distance = rtlActive ? move_distance - 8 : move_distance + 8;
    }

    if (mobile_device) {
      vertical_level = parseInt(index / 2, 10);
      vertical_level = vertical_level * 38;
    }
    var movingTabStyle = {
      width: step_width,
      transform:
        'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
      transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)',
    };
    setMovingTabStyle(movingTabStyle);
  };

  const navigationStepChange = (key) => {
    if (steps) {
      var validationState = steps[currentStep].isValidated();
      if (key > currentStep) {
        for (var i = currentStep; i < key; i++) {
          if ([steps[i].stepId].sendState !== undefined) {
            setAllState({
              ...allState,
              [steps[i].stepId]: [steps[i].stepId].sendState(),
            });
          }
          if (
            [steps[i].stepId].isValidated !== undefined &&
            [steps[i].stepId].isValidated() === false
          ) {
            validationState = false;
            break;
          }
        }
      }

      if (validationState) {
        if (
          steps[currentStep]?.updateRoleName !== undefined &&
          steps[currentStep]?.updateRoleName.changed &&
          steps[currentStep]?.updateRoleName.roleName !==
            steps[currentStep]?.values?.roleName
        ) {
          finishButtonClick();
        } else {
          setCurrentStep(key);
          setNextButton(steps.length > key + 1 ? true : false);
          setPreviousButton(key > 0 ? true : false);
          setFinishButton(steps.length === key + 1 ? true : false);
          refreshAnimation(key);
        }
      }
    }
  };

  const nextButtonClick = () => {
    if (steps[currentStep].isValidated()) {
      if (
        steps[currentStep]?.updateRoleName !== undefined &&
        steps[currentStep]?.updateRoleName.changed &&
        steps[currentStep]?.updateRoleName.roleName !==
          steps[currentStep]?.values?.roleName
      ) {
        finishButtonClick();
      } else {
        var key = currentStep + 1;
        setCurrentStep(key);
        setNextButton(steps.length > key + 1 ? true : false);
        setPreviousButton(key > 0 ? true : false);
        setFinishButton(steps.length === key + 1 ? true : false);
        refreshAnimation(key);
      }
    }
  };

  const previousButtonClick = () => {
    if ([steps[currentStep].stepId].sendState !== undefined) {
      setAllState({
        ...allState,
        [steps[currentStep].stepId]: [steps[currentStep].stepId].sendState(),
      });
    }
    var key = currentStep - 1;
    if (key >= 0) {
      setCurrentStep(key);
      setNextButton(steps.length > key + 1 ? true : false);
      setPreviousButton(key > 0 ? true : false);
      setFinishButton(steps.length === key + 1 ? true : false);
      refreshAnimation(key);
    }
  };

  return (
    <div className={classes.wizardContainer} ref={wizard}>
      <Card className={classes.card}>
        <div className={classes.wizardHeader}>
          <h3 className={classes.title}>{title}</h3>
          <h5 className={classes.subtitle}>{subtitle}</h5>
        </div>
        <div className={classes.wizardNavigation}>
          <ul className={classes.nav}>
            {steps.map((prop, key) => {
              return (
                <li
                  className={classes.steps}
                  key={key}
                  style={{ width: width }}>
                  <a
                    href='#'
                    className={classes.stepsAnchor}
                    onClick={(e) => {
                      e.preventDefault();
                      navigationStepChange(key);
                    }}>
                    {prop.stepName}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className={classes.movingTab} style={movingTabStyle}>
            {steps[currentStep].stepName}
          </div>
        </div>
        <div className={classes.content}>
          {steps.map((prop, key) => {
            const stepContentClasses = cx({
              [classes.stepContentActive]: currentStep === key,
              [classes.stepContent]: currentStep !== key,
            });
            return (
              <div
                className={
                  stepContentClasses + ` animate__animated animate__zoomIn`
                }
                key={key}>
                <prop.stepComponent {...steps[0]} />
              </div>
            );
          })}
        </div>
        <div className={classes.footer}>
          <div className={classes.left}>
            {previousButton ? (
              <Button
                style={{ marginBottom: 10 }}
                variant='contained'
                size='large'
                className={previousButtonClasses}
                onClick={() => previousButtonClick()}>
                {previousButtonText}
              </Button>
            ) : null}
          </div>
          <div className={classes.right}>
            {nextButton ? (
              <Button
                style={{ marginBottom: 10 }}
                variant='contained'
                size='large'
                color='secondary'
                className={nextButtonClasses}
                // type="submit"
                onClick={() => nextButtonClick()}>
                {nextButtonText}
              </Button>
            ) : null}
            {finishButton ? (
              <Button
                style={{ marginBottom: 10 }}
                variant='contained'
                size='large'
                color='secondary'
                className={finishButtonClasses}
                onClick={() => finishButtonClick()}
                disabled={
                  role_id == undefined
                    ? createButtonDisabled
                    : updateButtonDisabled
                }>
                {finishButtonText}
              </Button>
            ) : null}
          </div>
          <div className={classes.clearfix} />
        </div>
      </Card>
    </div>
  );
};

Wizard.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      stepName: PropTypes.string.isRequired,
      stepComponent: PropTypes.func.isRequired,
      stepId: PropTypes.string.isRequired,
      isValidated: PropTypes.func.isRequired,
      handleChange: PropTypes.func.isRequired,
      values: PropTypes.object.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  previousButtonClasses: PropTypes.string,
  previousButtonText: PropTypes.string,
  nextButtonClasses: PropTypes.string,
  nextButtonText: PropTypes.string,
  finishButtonClasses: PropTypes.string,
  finishButtonText: PropTypes.string,
  finishButtonClick: PropTypes.func,
  validate: PropTypes.bool,
};

export default Wizard;
