import Link from "next/link";
import React from "react";

const CopyrightText = () => {
  return (
    <p>
      Copyright © {new Date().getFullYear()} por <Link href="/">Jonahbruzzi</Link> {' '}
      Todos los derechos reservados.
    </p>
  );
};

export default CopyrightText;
