import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import shape from "@assets/img/shape/offcanvas-shape-1.png";
import logo from "@assets/img/logo/jonahbruzzi-mark.svg";
import MobileMenus from "./mobile-menus";
import SocialLinks from "@components/social";

const OffCanvas = ({ isOffCanvasOpen, setIsOffCanvasOpen }) => {
  return (
    <React.Fragment>
      <div
        className={`offcanvas__area offcanvas__area-1 ${
          isOffCanvasOpen ? "offcanvas-opened" : ""
        }`}
      >
        <div className="offcanvas__wrapper">
          <div className="offcanvas__shape">
            <Image className="offcanvas__shape-1" src={shape} alt="shape" />
          </div>
          <div className="offcanvas__close">
            <button
              onClick={() => setIsOffCanvasOpen(false)}
              className="offcanvas__close-btn offcanvas-close-btn"
            >
              <i className="fa-regular fa-xmark"></i>
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-40 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo jb-logo-mark">
                <Link href="/">
                  <Image src={logo} alt="Jonahbruzzi" width={48} height={48} />
                </Link>
              </div>
            </div>
            <div className="mobile-menu-3 fix mb-40 menu-counter mean-container d-lg-none">
              <div className="mean-bar">
                {/* MobileMenus start*/}
                <MobileMenus />
                {/* MobileMenus end*/}
              </div>
            </div>
            <div className="offcanvas__btn">
              <Link href="/shop" className="tp-btn-offcanvas">
                Ir a la tienda <i className="fa-regular fa-chevron-right"></i>
              </Link>
            </div>
            <div className="offcanvas__social">
              <h3 className="offcanvas__social-title">Síguenos :</h3>
              <SocialLinks />
            </div>
            <div className="offcanvas__contact">
              <p className="offcanvas__contact-mail">
                <a href="mailto:contacto@jonahbruzzi.me">contacto@jonahbruzzi.me</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div
        onClick={() => setIsOffCanvasOpen(false)}
        className={`body-overlay ${isOffCanvasOpen ? "opened" : ""}`}
      ></div>
      {/* overlay */}
    </React.Fragment>
  );
};

export default OffCanvas;
