import Link from 'next/link';
// internal
import banner from '@assets/img/banner/banner-1.jpg';
import { RightArrow } from '@svg/index';

const ShopBanner = () => {
  return (
    <section className="banner__area">
      <div className="container">
        <div className="banner__inner include-bg" style={{backgroundImage:`url(${banner.src})`}}>
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-8">
              <div className="banner__content">
                <span>Apple iPhone 12 Pro</span>
                <h3 className="banner__title">
                  <Link href="/shop">La espera terminó: iPhone 12 Pro Max</Link>
                </h3>
                <p>Última oportunidad con hasta <span>32%</span> de descuento</p>

                <div className="banner__btn">
                  <Link href="/shop" className="tp-btn">
                    Comprar ahora
                    <RightArrow/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBanner;