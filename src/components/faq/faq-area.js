
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
                      title="Preguntas generales"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem
                      id="community"
                      icon={<DotsTwo />}
                      title="Comunidad"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem id="support" icon={<Support />} title="Soporte" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="faq__item-wrapper">
            <div className="tab-content" id="faqTabContent">
              {/* general */}
              <TabItem
                active={true}
                id="general"
                accordion_items={[
                  {
                    title: (
                      <>
                        Pedidos <br />y envíos
                      </>
                    ),
                    accordions: [
                      {
                        id: "One",
                        title: "Optimización global para motores de búsqueda",
                        show: true,
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Two",
                        title: " Integración completa con redes sociales",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Three",
                        title: "Estrategia de marca para startups",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "four",
                        title: "¿Por cuánto tiempo tengo soporte y actualizaciones?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-1_accordion",
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
                        id: "five",
                        title: "¿Cómo sé que mi paquete fue enviado?",
                        show: true,
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-2_accordion",
                      },
                      {
                        id: "six",
                        title:
                          "¿Por qué algunos productos no están disponibles para envío internacional?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-2_accordion",
                      },
                      {
                        id: "seven",
                        title: "¿Por qué mi número de seguimiento no se actualiza?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-2_accordion",
                      },
                    ],
                  },
                  {
                    title: "Descuentos",
                    accordions: [
                      {
                        id: "eight",
                        title: "¿Cómo sé que mi paquete fue enviado?",
                        show: true,
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-3_accordion",
                      },
                      {
                        id: "nine",
                        title:
                          "¿Por qué algunos productos no están disponibles para envío internacional?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-3_accordion",
                      },
                      {
                        id: "ten",
                        title: "¿Por qué mi número de seguimiento no se actualiza?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "general-3_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* community */}
              <TabItem
                id="community"
                accordion_items={[
                  {
                    title: (
                      <>
                        Devoluciones <br />y cambios
                      </>
                    ),
                    accordions: [
                      {
                        id: "eleven",
                        title: "¿Puedo cancelar mi cuenta en cualquier momento?",
                        show: true,
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "community-1_accordion",
                      },
                      {
                        id: "twelve",
                        title: "¿Qué pasa cuando vence la licencia?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "community-1_accordion",
                      },
                      {
                        id: "thirteen",
                        title: "¿Jonahbruzzi cuenta con documentación?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "community-1_accordion",
                      },
                      {
                        id: "fourteen",
                        title: "¿Por cuánto tiempo tengo soporte y actualizaciones?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "community-1_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* support */}
              <TabItem
                id="support"
                accordion_items={[
                  {
                    title: "Descuentos",
                    accordions: [
                      {
                        id: "fifteen",
                        title: "¿Puedo cancelar mi cuenta en cualquier momento?",
                        show: true,
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "sixteen",
                        title: "¿Qué pasa cuando vence la licencia?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "seventeen",
                        title: "¿Jonahbruzzi cuenta con documentación?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "eighteen",
                        title: "¿Por cuánto tiempo tengo soporte y actualizaciones?",
                        desc: "Una startup nace de fundadores o emprendedores individuales que buscan un modelo de negocio repetible y escalable. Una startup nace de fundadores individuales",
                        parent: "support-1_accordion",
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
