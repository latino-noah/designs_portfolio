/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Anything marked  // TODO  is a placeholder — replace it with
 *  your real info. Images live in /public/images; after adding
 *  new ones run `npm run images` to generate optimised WebP files
 *  in /public/images/web.
 * ─────────────────────────────────────────────────────────────
 */

export const person = {
  firstName: 'Noah',
  lastName: 'Da Conceição',
  role: ['Creative Developer', 'UI Designer'],
  city: 'Rotterdam',
  country: 'NL',
  timezone: 'Europe/Amsterdam',
  coords: '51.9225° N — 4.4792° E',
  email: 'hello@example.com', // TODO: your public contact email
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' }, // TODO
    { label: 'GitHub', href: 'https://github.com/latino-noah' },
    { label: 'Instagram', href: 'https://www.instagram.com/your-handle' }, // TODO (or remove)
  ],
  available: 'Open for internships & freelance — 2027', // TODO
};

export const nav = [
  { label: 'Index', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Route', href: '#route' },
  { label: 'Contact', href: '#contact' },
];

export const about = {
  // Words wrapped in [brackets] get the sun accent colour. {img:N} inserts an inline photo pill.
  statement:
    "I'm Noah — a [creative developer] and [UI designer] from Rotterdam. I design interfaces that feel {img:0} alive, then build them with code that moves with intent. Half designer, half engineer, fully obsessed with the {img:1} details nobody asks for.",
  inlineImages: ['/images/web/gallery-2.webp', '/images/web/gallery-6.webp'],
  portrait: '/images/web/gallery-1.webp',
  portraitAlt: 'Noah silhouetted against a sunset, standing in the sea and pointing at the horizon',
  interests: [
    {
      title: 'UI / UX design',
      text: 'Interfaces with a clear point of view. I start with structure and hierarchy, then push typography and composition until the page has a voice of its own.',
    },
    {
      title: 'Front-end development',
      text: 'Semantic, accessible, fast. I build in React and plain JavaScript, and I care about the parts users never see — clean components, sensible state, good performance.',
    },
    {
      title: 'Creative coding',
      text: 'Scroll choreography, WebGL, 3D. GSAP, Three.js and Blender are where design and engineering blur — and where I have the most fun.',
    },
  ],
  approach: [
    { n: '01', title: 'Listen', text: 'Understand the people, the goal and the feeling the site should leave behind.' },
    { n: '02', title: 'Sketch', text: 'Wireframes, moodboards and motion studies before a single pixel is final.' },
    { n: '03', title: 'Build', text: 'Prototype in the browser early. Motion is designed in code, not just in Figma.' },
    { n: '04', title: 'Polish', text: 'Timing, easing, spacing, accessibility. The last 10% is where it becomes memorable.' },
  ],
};

export const fieldNotes = {
  marquee: 'Take the leap',
  images: [
    { src: '/images/web/gallery-9.webp', alt: 'Two people standing on top of a tall sea cliff' },
    { src: '/images/web/gallery-2.webp', alt: 'A backflip off a harbour pier into the sea' },
    { src: '/images/web/gallery-5.webp', alt: 'Parasailing high above the water under a striped canopy' },
    { src: '/images/web/gallery-8.webp', alt: 'Sunset over the sea with mountains on the horizon' },
  ],
};

/** Projects. `image` is shown in the gallery and the case-study view. TODO: replace descriptions, links and years. */
export const projects = [
  {
    id: 'summit',
    title: 'Summit',
    kind: 'Travel platform — concept',
    year: '2026',
    image: '/images/web/work-6.webp',
    alt: 'Travel website hero with the word TRAVEL masked behind a mountain peak',
    description:
      'A hiking-travel concept built around one idea: the mountain is the interface. Oversized type slips behind the peaks as you scroll.',
    role: 'Concept, UI design, front-end',
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    challenge:
      'Make a travel site feel like standing at the trailhead — without heavy video or a slow first load.',
    solution:
      'A layered, cut-out photograph with foreground masking parallax, a restrained UI and a single call to action.',
    link: '#', // TODO
  },
  {
    id: 'nts-goons',
    title: 'NTS Goons',
    kind: 'Product experience — 3D',
    year: '2025',
    image: '/images/web/work-4.webp',
    alt: 'Pink product page with a floating Air Jordan 1 sneaker and spheres',
    description:
      'A playful sneaker drop page with a floating 3D Air Jordan, physics-y spheres and a 360° viewer to inspect every stitch.',
    role: '3D modelling, UI design, development',
    tech: ['Three.js', 'Blender', 'JavaScript', 'CSS'],
    challenge: 'Let people inspect a product in 3D without turning the page into a heavy tech demo.',
    solution: 'An optimised Blender model in Three.js, lazy-loaded behind a light poster image, with soft pastel art direction.',
    link: '#', // TODO
  },
  {
    id: 'urban-digital',
    title: 'Urban Digital',
    kind: 'Agency website',
    year: '2025',
    image: '/images/web/work-5.webp',
    alt: 'Dark agency website hero for web design, video and photography services',
    description:
      'A conversion-focused site for a small studio offering web design, video and photography — clear services, pricing and trust signals.',
    role: 'UI design, front-end development',
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    challenge: 'Communicate three services and pricing to local businesses in a single scroll.',
    solution: 'A reusable component system in React + Tailwind and a strong, focused hero with two clear paths.',
    link: '#', // TODO
  },
  {
    id: 'gianni-watson',
    title: 'Gianni Watson',
    kind: 'Personal portfolio — client',
    year: '2025',
    image: '/images/web/work-2.webp',
    alt: 'Minimal black portfolio with the words CREATING VISUAL PEACE',
    description:
      'A quiet, typographic portfolio for a visual creator. Black canvas, one statement, letting the work and the vlogs speak.',
    role: 'Art direction, development',
    tech: ['HTML', 'CSS', 'GSAP'],
    challenge: 'Create calm in a genre that is usually loud.',
    solution: 'Radical reduction: one typeface, generous space and slow, deliberate motion.',
    link: '#', // TODO
  },
  {
    id: 'parallax-lab',
    title: 'Parallax Lab',
    kind: 'Motion study',
    year: '2024',
    image: '/images/web/work-3.webp',
    alt: 'Black and white photo of a person filming with a camcorder on a rooftop, with the words BACKGROUND PARALLAX',
    description:
      'A series of scroll experiments — background parallax, sticky reveals and masking — that became the toolkit behind my later work.',
    role: 'Research, creative coding',
    tech: ['GSAP', 'ScrollTrigger', 'JavaScript'],
    challenge: 'Understand why some scroll effects feel cinematic and others feel cheap.',
    solution: 'Dozens of small studies tuning easing, distance and speed until it clicked.',
    link: '#', // TODO
  },
  {
    id: 'portfolio-v1',
    title: 'Giving it 100%',
    kind: 'Portfolio v1',
    year: '2024',
    image: '/images/web/work-1.webp',
    alt: 'Earlier portfolio with a black and white rooftop photo and the headline ARE YOU GIVING IT A 100%',
    description:
      'My first portfolio. Black and white photography, big statements and the start of a long obsession with web motion.',
    role: 'Design & development',
    tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    challenge: 'Show who I am before I had a body of client work.',
    solution: 'Lead with personality: my own photography and a headline that doubles as a motto.',
    link: '#', // TODO
  },
];

/** Skills. level: 1–5, drawn as a peak in the elevation profile. */
export const skills = [
  {
    id: 'design',
    title: 'Design',
    tagline: 'Shaping how it looks, flows and feels.',
    items: [
      { name: 'UI / UX Design', level: 5, note: 'Daily driver' },
      { name: 'Wireframing', level: 4, note: 'Confident' },
      { name: 'Prototyping', level: 4, note: 'Confident' },
      { name: 'Figma', level: 5, note: 'Daily driver' },
      { name: 'Adobe Creative Suite', level: 3, note: 'Comfortable' },
    ],
  },
  {
    id: 'develop',
    title: 'Develop',
    tagline: 'Turning designs into fast, accessible code.',
    items: [
      { name: 'HTML', level: 5, note: 'Daily driver' },
      { name: 'CSS', level: 5, note: 'Daily driver' },
      { name: 'JavaScript', level: 4, note: 'Confident' },
      { name: 'React', level: 4, note: 'Confident' },
      { name: 'Bootstrap', level: 3, note: 'Comfortable' },
      { name: 'Tailwind CSS', level: 4, note: 'Confident' },
    ],
  },
  {
    id: 'create',
    title: 'Create',
    tagline: 'Motion, depth and a bit of magic.',
    items: [
      { name: 'GSAP', level: 5, note: 'Daily driver' },
      { name: 'Three.js', level: 3, note: 'Growing fast' },
      { name: 'Blender', level: 3, note: 'Growing fast' },
      { name: '3D Web Experiences', level: 3, note: 'Growing fast' },
      { name: 'Scroll Animations', level: 5, note: 'Daily driver' },
    ],
  },
];

/** Experience timeline. TODO: replace with your real education, internship and dates. */
export const route = [
  {
    year: '2022',
    type: 'Milestone',
    title: 'First line of code',
    place: 'Self-taught',
    text: 'Rebuilt websites I liked from scratch to understand how they worked. HTML and CSS first, then JavaScript.',
    alt: '+0120 m',
  },
  {
    year: '2023',
    type: 'Education',
    title: 'Creative Media & Development',
    place: 'Grafisch Lyceum Rotterdam', // TODO: confirm school & programme name
    text: 'Design fundamentals, typography, UX research and front-end development. Where design and code first met.',
    alt: '+0480 m',
  },
  {
    year: '2024',
    type: 'Project',
    title: 'Discovering motion',
    place: 'Parallax Lab',
    text: 'Fell into GSAP and ScrollTrigger. Built dozens of small scroll studies and my first portfolio.',
    alt: '+0910 m',
  },
  {
    year: '2025',
    type: 'Internship',
    title: 'Front-end & Motion Intern',
    place: 'Studio Name — Rotterdam', // TODO
    text: 'Built production React components, animated marketing pages and worked side-by-side with designers on handoff and prototyping.',
    alt: '+1640 m',
  },
  {
    year: '2026',
    type: 'Now',
    title: 'Creative developer',
    place: 'Freelance & studies',
    text: 'Designing and building cinematic web experiences, going deeper into Three.js, shaders and 3D.',
    alt: '+2210 m',
  },
];
