import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '电力电子技术',
    Svg: require('@site/static/img/电路.svg').default,
    description: (
      <>
         理论研究、硬件设计、仿真验证与软件开发
      </>
    ),
  },
  {
    title: '效率工具',
    Svg: require('@site/static/img/提高效率.svg').default,
    description: (
      <>
        缩短开发周期，助力开发者
      </>
    ),
  },
  {
    title: '人工智能',
    Svg: require('@site/static/img/人工智能.svg').default,
    description: (
      <>
         拥抱未来，探索未知
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
