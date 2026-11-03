/**
 * WebGL hover distortion for project images (Three.js).
 *
 * One renderer/canvas is shared. On hover it is moved *inside* the hovered media
 * element so stacking order is untouched, then renders the image texture on a plane
 * matching the <img>'s box (including its parallax offset) with a lens + RGB-split
 * shader driven by cursor position and velocity. At rest the shader outputs the
 * untouched image, so swapping between <img> and canvas is invisible.
 */
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
  Vector2,
  LinearSRGBColorSpace,
  NoColorSpace,
} from 'three';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  // object-fit: cover
  vec2 cover(vec2 uv) {
    vec2 r = uPlane / uImage;
    float s = max(r.x, r.y);
    vec2 size = uImage * s;
    vec2 off = (size - uPlane) * 0.5;
    return (uv * uPlane + off) / size;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uPlane.x / uPlane.y;
    vec2 d = uv - uMouse;
    d.x *= aspect;
    float lens = smoothstep(0.6, 0.0, length(d)) * uHover;

    uv -= (uv - uMouse) * lens * 0.2;
    uv.x += sin(uv.y * 16.0 + uTime * 2.0) * 0.0035 * uHover;
    uv.y += cos(uv.x * 12.0 + uTime * 1.6) * 0.0035 * uHover;

    vec2 shift = (uVel * 0.06 + vec2(0.0015, 0.0)) * uHover;
    float r = texture2D(uTex, cover(uv + shift)).r;
    float g = texture2D(uTex, cover(uv)).g;
    float b = texture2D(uTex, cover(uv - shift)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export default class HoverDistortion {
  constructor(gsap) {
    this.gsap = gsap;
    this.renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.canvas = this.renderer.domElement;
    this.canvas.className = 'distort-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');

    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -10, 10);
    this.uniforms = {
      uTex: { value: null },
      uPlane: { value: new Vector2(1, 1) },
      uImage: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uVel: { value: new Vector2() },
      uHover: { value: 0 },
      uTime: { value: 0 },
    };
    this.mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({ uniforms: this.uniforms, vertexShader: vertex, fragmentShader: fragment })
    );
    this.scene.add(this.mesh);

    this.loader = new TextureLoader();
    this.textures = new Map();
    this.mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    this.active = null;
    this.tick = this.tick.bind(this);
  }

  load(src) {
    if (!this.textures.has(src)) {
      this.textures.set(
        src,
        new Promise((resolve) =>
          this.loader.load(src, (t) => {
            t.colorSpace = NoColorSpace;
            resolve(t);
          }, undefined, () => resolve(null))
        )
      );
    }
    return this.textures.get(src);
  }

  async enter(media, img, e) {
    const tex = await this.load(img.currentSrc || img.src);
    if (!tex || !media.matches(':hover')) return;

    this.active = { media, img };
    this.uniforms.uTex.value = tex;
    this.uniforms.uImage.value.set(tex.image.width, tex.image.height);
    this.updateMouse(e, true);

    const r = media.getBoundingClientRect();
    this.renderer.setSize(r.width, r.height, false);
    this.camera.left = -r.width / 2;
    this.camera.right = r.width / 2;
    this.camera.top = r.height / 2;
    this.camera.bottom = -r.height / 2;
    this.camera.updateProjectionMatrix();

    media.appendChild(this.canvas);
    this.gsap.ticker.remove(this.tick);
    this.gsap.ticker.add(this.tick);
    this.gsap.to(this.uniforms.uHover, { value: 1, duration: 0.9, ease: 'power3.out', overwrite: true });
  }

  leave() {
    if (!this.active) return;
    const ref = this.active;
    this.gsap.to(this.uniforms.uHover, {
      value: 0,
      duration: 0.7,
      ease: 'power3.out',
      overwrite: true,
      onComplete: () => {
        if (this.active !== ref) return;
        this.gsap.ticker.remove(this.tick);
        this.canvas.remove();
        this.active = null;
      },
    });
  }

  updateMouse(e, snap = false) {
    if (!this.active) return;
    const r = this.active.img.getBoundingClientRect();
    this.mouse.tx = (e.clientX - r.left) / r.width;
    this.mouse.ty = 1 - (e.clientY - r.top) / r.height;
    if (snap) {
      this.mouse.x = this.mouse.tx;
      this.mouse.y = this.mouse.ty;
    }
  }

  tick(time) {
    if (!this.active) return;
    const { media, img } = this.active;
    const m = media.getBoundingClientRect();
    const i = img.getBoundingClientRect();

    // Plane follows the <img> box (which is larger + offset for parallax) inside the media frame.
    this.mesh.scale.set(i.width, i.height, 1);
    this.mesh.position.set(i.left + i.width / 2 - (m.left + m.width / 2), -(i.top + i.height / 2 - (m.top + m.height / 2)), 0);
    this.uniforms.uPlane.value.set(i.width, i.height);

    const px = this.mouse.x;
    const py = this.mouse.y;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.12;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.12;
    const vel = this.uniforms.uVel.value;
    vel.x += ((this.mouse.x - px) * 4 - vel.x) * 0.2;
    vel.y += ((this.mouse.y - py) * 4 - vel.y) * 0.2;

    this.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
    this.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.gsap.ticker.remove(this.tick);
    this.canvas.remove();
    this.textures.forEach((p) => p.then((t) => t?.dispose()));
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.renderer.dispose();
  }
}
