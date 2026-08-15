// internal
import {Payment, Refund, ShippingCar, Support} from "@svg/index";

// SingleFeature
function SingleFeature({ icon, title, subtitle }) {
  return (
    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
      <div className="features__item-13 d-flex align-items-start mb-40">
        <div className="features__icon-13">
          <span>{icon}</span>
        </div>
        <div className="features__content-13">
          <h3 className="features__title-13">{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const ShopFeature = () => {
  return (
    <>
      <section className="features__area pt-80 pb-20">
        <div className="container">
          <div className="row">
            <SingleFeature
              icon={<ShippingCar />}
              title="Envío gratis"
              subtitle={
                <>
                  Envío gratis en pedidos <br /> sobre $120
                </>
              }
            />
            <SingleFeature
              icon={<Refund/>}
              title="Devoluciones"
              subtitle={
                <>
                  Dentro de 30 días para un <br /> cambio.
                </>
              }
            />
            <SingleFeature
              icon={<Support />}
              title="Soporte"
              subtitle={
                <>
                  24 horas al día, 7 días <br /> a la semana
                </>
              }
            />
            <SingleFeature
              icon={<Payment />}
              title="Pago"
              subtitle={
                <>
                  Paga con múltiples <br /> tarjetas de crédito
                </>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopFeature;
