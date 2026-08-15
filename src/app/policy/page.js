import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SectionTop from "@components/terms-policy/section-top-bar";
import PolicyArea from "@components/terms-policy/policy-area";

export const metadata = {
  title: "Política de privacidad",
};

export default function Policy() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <SectionTop
        title="Política de privacidad"
        subtitle={
          <>
            Tu privacidad es importante para nosotros. Es política de
            Jonahbruzzi respetar tu privacidad <br /> respecto a cualquier
            información que podamos recopilar en nuestro sitio,
            jonahbruzzi.me, <br /> y otros sitios que operamos.
          </>
        }
      />
      <PolicyArea />
      <Footer />
    </Wrapper>
  );
}
