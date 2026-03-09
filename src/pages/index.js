import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import Heading from '@theme/Heading';
import styles from './index.module.css';

import kumamonJpg from '@site/static/img/熊本熊.jpg';
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

        {/* 插入 JPG 图像 */}
        <div className="kumamon-wrapper">
          <img src={kumamonJpg} alt="熊本熊" />
        </div>

        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <div className="container">
            在这里我会分享各类技术栈所遇到问题与解决方案，希望我的开发经历对你有所启发✨
        </div>
        {/* 空白行 */}
        <div style={{ height: '20px' }}></div>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/me">
            关于我 😎
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Beanspower 电力电子技术 人工智能 效率工具<head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
