import clsx from 'clsx'
import {Parallax, ParallaxProvider} from 'react-scroll-parallax'
import parallaxStyles from './parallax-style'

export default function DotParallax() {
  const classes = parallaxStyles()
  return (
    <div className={clsx(classes.parallaxWrap, classes.dotsWrap)}>
      <ParallaxProvider>
        <div className={classes.innerParallax}>
          <Parallax y={[-30, 40]} tagOuter="figure">
            <svg fill="#cccccc" width={902} height={1042} className={classes.parallaxDot}>
              <use xlinkHref="/images/svg/dot-deco.svg#dot" />
            </svg>
          </Parallax>
        </div>
      </ParallaxProvider>
    </div>
  )
}
