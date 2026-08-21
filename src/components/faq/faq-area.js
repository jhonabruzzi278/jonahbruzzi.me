
import { DotsTwo, General, Support } from "@svg/index";
import FaqThumb from "./faq-thumb";
import SingleFaq from "./single-faq";

// single nav
function NavItem({ active, id, title, icon }) {
  return (
    <button
      className={`nav-link ${active ? "active" : ""}`}
      id={`nav-${id}-tab`}
      data-bs-toggle="tab"
      data-bs-target={`#${id}`}
      type="button"
      role="tab"
      aria-controls={`nav-${id}`}
      aria-selected={active ? "true" : "false"}
      tabIndex="-1"
    >
      <span>{icon}</span>
      {title}
    </button>
  );
}

// TabItem
export function TabItem({ active, id, accordion_items }) {
  return (
    <div
      className={`tab-pane fade ${active ? "show active" : ""}`}
      id={`${id}`}
      role="tabpanel"
      aria-labelledby={`nav-${id}-tab`}
    >
      {/* <!-- faq item one of community question --> */}
      {accordion_items.map((item, i) => (
        <div key={i} className="faq__item pb-95">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-4">
              <div className="faq__content">
                <h3 className="faq__title-2">{item.title}</h3>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-8">
              <div className="faq__wrapper faq__style-4 tp-accordion">
                <div className="accordion" id={`${id}-${i + 1}_accordion`}>
                  {item.accordions.map((item) => (
                    <SingleFaq key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


const FaqArea = ({ element_faq = false }) => {
  // tab item
  return (
    <>
      {/* faq thumb start */}
      {!element_faq && <FaqThumb />}
      {/* faq thumb end */}

      {/* faq area start */}
      <section className="faq__area pt-100 pb-25">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="faq__tab-2 tp-tab mb-50">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <NavItem
                      active={true}
                      id="general"
                      icon={<General />}
                      title="Pedidos y envíos"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem
                      id="community"
                      icon={<DotsTwo />}
                      title="Pagos y devoluciones"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem id="support" icon={<Support />} title="Cuenta y soporte" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="faq__item-wrapper">
            <div className="tab-content" id="faqTabContent">
              {/* Pedidos y envíos */}
              <TabItem
                active={true}
                id="general"
                accordion_items={[
                  {
                    title: (
                      <>
                        Envíos <br />y tiempos de entrega
                      </>
                    ),
                    accordions: [
                      {
                        id: "One",
                        title: "¿A qué lugares hacen envíos?",
                        show: true,
                        desc: "Hacemos envíos a todo Chile a través de nuestro método de envío estándar.",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Two",
                        title: "¿Cuánto cuesta el envío?",
                        desc: "El envío estándar tiene un costo fijo de $3.990, sin importar la cantidad de productos de tu pedido.",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Three",
                        title: "¿Cuánto demora en llegar mi pedido?",
                        desc: "El tiempo de entrega depende de tu ubicación. Apenas despachamos tu pedido, te enviamos la información de seguimiento a tu correo.",
                        parent: "general-1_accordion",
                      },
                    ],
                  },
                  {
                    title: (
                      <>
                        Mi <br />pedido
                      </>
                    ),
                    accordions: [
                      {
                        id: "five",
                        title: "¿Cómo hago seguimiento de mi pedido?",
                        show: true,
                        desc: "Podés revisar el estado de tu pedido desde tu cuenta, en la sección \"Mis pedidos\".",
                        parent: "general-2_accordion",
                      },
                      {
                        id: "six",
                        title: "¿Puedo modificar o cancelar mi pedido después de comprarlo?",
                        desc: "Escribinos apenas puedas a contacto@jonahbruzzi.me con tu número de pedido — si todavía no lo despachamos, vamos a intentar ayudarte.",
                        parent: "general-2_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* Pagos y devoluciones */}
              <TabItem
                id="community"
                accordion_items={[
                  {
                    title: (
                      <>
                        Formas <br />de pago
                      </>
                    ),
                    accordions: [
                      {
                        id: "eleven",
                        title: "¿Qué métodos de pago aceptan?",
                        show: true,
                        desc: "Aceptamos pagos a través de Mercado Pago, incluyendo tarjetas de crédito y débito.",
                        parent: "community-1_accordion",
                      },
                      {
                        id: "twelve",
                        title: "¿Es seguro pagar en Jonahbruzzi?",
                        desc: "Sí. Todos los pagos se procesan directamente a través de Mercado Pago — nosotros nunca vemos ni almacenamos los datos de tu tarjeta.",
                        parent: "community-1_accordion",
                      },
                    ],
                  },
                  {
                    title: (
                      <>
                        Devoluciones <br />y cambios
                      </>
                    ),
                    accordions: [
                      {
                        id: "thirteen",
                        title: "¿Puedo devolver o cambiar un producto?",
                        show: true,
                        desc: "Sí, tenés 30 días desde que recibís tu pedido para solicitar un cambio.",
                        parent: "community-2_accordion",
                      },
                      {
                        id: "fourteen",
                        title: "¿Cómo solicito una devolución o cambio?",
                        desc: "Escribinos a contacto@jonahbruzzi.me con tu número de pedido y te explicamos los pasos a seguir.",
                        parent: "community-2_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* Cuenta y soporte */}
              <TabItem
                id="support"
                accordion_items={[
                  {
                    title: (
                      <>
                        Mi <br />cuenta
                      </>
                    ),
                    accordions: [
                      {
                        id: "fifteen",
                        title: "¿Necesito una cuenta para comprar?",
                        show: true,
                        desc: "Podés crear una cuenta para hacer seguimiento de tus pedidos y guardar tus datos para futuras compras.",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "sixteen",
                        title: "Olvidé mi contraseña, ¿qué hago?",
                        desc: "Desde la página de inicio de sesión podés solicitar restablecer tu contraseña.",
                        parent: "support-1_accordion",
                      },
                    ],
                  },
                  {
                    title: "Contacto",
                    accordions: [
                      {
                        id: "seventeen",
                        title: "¿Cómo los contacto?",
                        show: true,
                        desc: "Escribinos a contacto@jonahbruzzi.me y te respondemos a la brevedad.",
                        parent: "support-2_accordion",
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      {/* faq area end */}
    </>
  );
};

export default FaqArea;
