import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SectionTop from "@components/terms-policy/section-top-bar";
import Footer from "@layout/footer";
import TermsArea from "@components/terms-policy/terms-area";

export const metadata = {
  title: "Términos y condiciones",
};

export default function Terms() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <SectionTop
        title="Términos y condiciones"
        subtitle="Las palabras cuya letra inicial está en mayúscula tienen significados definidos bajo las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado ya sea que aparezcan en singular o en plural."
      />
      <TermsArea />
      <Footer />
    </Wrapper>
  );
}
