'use client';
// internal
import bg from "@assets/img/cta/13/cta-bg-1.jpg";

const ShopCta = () => {
  // handleSubmit
  const handleSubmit = e => {
    e.preventDefault();
  }
  return (
    <section
      className="cta__area pt-50 pb-50 p-relative include-bg jarallax"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="container">
        <div className="cta__inner-13 white-bg">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="cta__content-13">
                <h3 className="cta__title-13">
                  Suscríbete a <br />
                  las últimas tendencias y ofertas
                </h3>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="cta__form-13">
                <form onSubmit={handleSubmit}>
                  <div className="cta__input-13">
                    <input type="email" placeholder="Ingresa tu correo electrónico" />
                    <button type="submit" className="tp-btn">
                      Suscribirse
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCta;
