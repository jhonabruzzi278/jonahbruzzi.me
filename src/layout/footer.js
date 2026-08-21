import Link from "next/link";
import Image from "next/image";
// internal
import logo from '@assets/img/logo/jonahbruzzi-mark.svg';
import payment from '@assets/img/footer/footer-payment.png';
import SocialLinks from "@components/social";
import CopyrightText from "./copyright-text";

// single widget
function SingleWidget({ col, col_2, col_3, title, contents }) {
  return (
    <div
      className={`col-xxl-${col} col-xl-${col} col-lg-3 col-md-${col_2} col-sm-6"`}
    >
      <div className={`footer__widget mb-50 footer-col-11-${col_3}`}>
        <h3 className="footer__widget-title">{title}</h3>
        <div className="footer__widget-content">
          <ul>
            {contents.map((l, i) => (
              <li key={i}>
                <Link href={`/${l.url}`}>{l.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Footer = () => {
  return (
    <>
      <footer>
        <div
          className="footer__area footer__style-4"
          data-bg-color="footer-bg-white"
        >
          <div className="footer__top">
            <div className="container">
              <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget footer__widget-11 mb-50 footer-col-11-1">
                    <div className="footer__logo">
                      <Link href="/" className="jb-logo-mark">
                        <Image src={logo} alt="Jonahbruzzi" width={56} height={56} />
                      </Link>
                    </div>

                    <div className="footer__widget-content">
                      <div className="footer__info">
                        <p>
                          Cosas que vale la pena descubrir. Tecnología, hogar,
                          moda y productos interesantes que encontramos por
                          Internet.
                        </p>
                        <div className="footer__social footer__social-11">
                          <SocialLinks/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SingleWidget
                  col="2"
                  col_2="4"
                  col_3="2"
                  title="Empresa"
                  contents={[
                    { url: "about", title: "Sobre nosotros" },
                    { url: "contact", title: "Contacto" },
                  ]}
                />
                <SingleWidget
                  col="3"
                  col_2="3"
                  col_3="3"
                  title="Tienda"
                  contents={[
                    { url: "shop?category=tecnologia", title: "Tecnología" },
                    { url: "shop?category=hogar", title: "Hogar" },
                    { url: "shop?category=moda", title: "Moda" },
                    { url: "shop?category=belleza", title: "Belleza" },
                    { url: "shop?tag=ofertas", title: "Ofertas" },
                  ]}
                />
                <SingleWidget
                  col="1"
                  col_2="3"
                  col_3="4"
                  title="Ayuda"
                  contents={[
                    { url: "faq", title: "Preguntas frecuentes" },
                    { url: "policy", title: "Privacidad" },
                    { url: "terms", title: "Términos y condiciones" },
                  ]}
                />

                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget mb-50 footer-col-11-5">
                    <h3 className="footer__widget-title">Contáctanos</h3>

                    <div className="footer__widget-content">
                      <div className="footer__contact">
                        <div className="footer__contact-mail">
                          <span>
                            <a href="mailto:contacto@jonahbruzzi.me">
                              contacto@jonahbruzzi.me
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="container">
              <div className="footer__bottom-inner">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="footer__copyright">
                      <CopyrightText />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="footer__payment text-sm-end">
                      <Image src={payment} alt="payment" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
