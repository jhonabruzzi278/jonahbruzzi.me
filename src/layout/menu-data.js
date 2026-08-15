// Category links use real WooCommerce product_cat slugs (?category=slug);
// collection links use product_tag slugs (?tag=slug) — see the Jonah
// Score/collections setup in the migration plan Phase 1a for how these
// were created in WooCommerce.
const menu_data = [
  {
    id: 1,
    title: 'Inicio',
    link: '/',
  },
  {
    id: 2,
    title: 'Tecnología',
    link: '/shop?category=tecnologia',
  },
  {
    id: 3,
    title: 'Hogar',
    link: '/shop?category=hogar',
  },
  {
    id: 4,
    title: 'Moda',
    link: '/shop?category=moda',
  },
  {
    id: 5,
    title: 'Belleza',
    link: '/shop?category=belleza',
  },
  {
    id: 6,
    title: 'Gaming',
    link: '/shop?category=gaming',
  },
  {
    id: 7,
    title: 'Tendencias',
    link: '/shop?tag=tendencias',
  },
  {
    id: 8,
    title: 'Ofertas',
    link: '/shop?tag=ofertas',
  },
  {
    id: 9,
    hasDropdown: true,
    title: 'Más',
    link: '/about',
    submenus: [
      { title: 'Nosotros', link: '/about' },
      { title: 'Contacto', link: '/contact' },
      { title: 'Preguntas frecuentes', link: '/faq' },
      { title: 'Privacidad', link: '/policy' },
      { title: 'Términos y condiciones', link: '/terms' },
      { title: 'Iniciar sesión', link: '/login' },
      { title: 'Crear cuenta', link: '/register' },
      { title: 'Mi carrito', link: '/cart' },
      { title: 'Favoritos', link: '/wishlist' },
    ]
  },
]

export default menu_data;
