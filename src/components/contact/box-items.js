import React from "react";
import Image from "next/image";
// internal
import SocialLinks from "@components/social";
import icon_1 from "@assets/img/contact/icon/contact-icon-1.png";
import icon_2 from "@assets/img/contact/icon/contact-icon-3.png";
import icon_3 from "@assets/img/contact/icon/contact-icon-2.png";

// single item
function SingleItem({ icon, title, content }) {
  return (
    <div className="col-xl-4 col-lg-4 col-md-6">
      <div className="contact__item text-center mb-30 transition-3 white-bg">
        <div className="contact__icon">
          <Image src={icon} alt="icon" />
        </div>
        <div className="contact__content">
          <span className="contact-item-subtitle">{title}</span>
          {content}
        </div>
      </div>
    </div>
  );
}

const BoxItems = () => {
  return (
    <div
      className={`contact__item-area contact__translate-2`}
    >
      <div className="container">
        <div className="row">
          <SingleItem
            icon={icon_1}
            title="Contacto"
            content={
              <p>
                <a href="mailto:contacto@jonahbruzzi.me">contacto@jonahbruzzi.me</a>
              </p>
            }
          />
          <SingleItem
            icon={icon_2}
            title="Envíos"
            content={
              <p>Hacemos envíos a todo Chile. Envío estándar $3.990.</p>
            }
          />
          <SingleItem
            icon={icon_3}
            title="Redes sociales"
            content={
              <>
                {" "}
                <p>Síguenos en redes sociales</p>
                <div className="contact__social">
                  <SocialLinks />
                </div>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BoxItems;
