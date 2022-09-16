const THREE = require("three");
const { debounce } = require("@ykob/js-util");

const SmoothScrollManager = require("../scroll/SmoothScrollManager").default;
const TitleObject = require("./TitleObject").default;
const PostEffect = require("./Post").default;

export default function () {
  const scrollManager = new SmoothScrollManager();

  const canvas = document.getElementById("canvas-webgl");
  const renderer = new THREE.WebGL1Renderer({
    antialias: false,
    canvas: canvas,
  });
  const renderBack = new THREE.WebGLRenderTarget(
    document.body.clientWidth,
    window.innerHeight
  );
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(
    45,
    document.body.clientWidth / window.innerHeight,
    1,
    10000
  );
  const clock = new THREE.Clock();
  const introObject = new TitleObject("/img/index/intro.png", 293, 17, 40, 10);
  const titleObject = new TitleObject("/img/index/title.png", 541, 45, 40, 10);
  const realObject = new TitleObject("/img/index/real.png", 299, 16, 40, 10);
  const goldObject = new TitleObject("/img/index/gold.jpeg", 400, 400, 40, 10);
  const tiedObject = new TitleObject("/img/index/tied.png", 178, 28, 40, 10);
  const priceObject = new TitleObject("/img/index/price.png", 183, 108, 40, 10);
  const limitedObject = new TitleObject("/img/index/limited.png", 183, 36, 40, 10);
  const twoObject = new TitleObject("/img/index/two.png", 183, 36, 40, 10);
  const cardsObject = new TitleObject("/img/index/cards.png", 183, 36, 40, 10);
  const freeObject = new TitleObject("/img/index/free.png", 183, 152, 40, 10);
  const callObject = new TitleObject("/img/index/call.png", 334, 72, 40, 10);
  const backedObject = new TitleObject("/img/index/backed.png", 164, 110, 40, 10);
  const review1Object = new TitleObject("/img/index/review1.png", 155, 80, 40, 10);
  const review2Object = new TitleObject("/img/index/review1.png", 155, 80, 40, 10);
  const postEffect = new PostEffect(renderBack.texture);

  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    cameraBack.aspect = document.body.clientWidth / window.innerHeight;
    cameraBack.updateProjectionMatrix();
    renderBack.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    postEffect.resize();
  };
  const render = () => {
    const time = clock.getDelta();
    introObject.render(time);
    titleObject.render(time);
    realObject.render(time);
    goldObject.render(time);
    tiedObject.render(time);
    priceObject.render(time);
    limitedObject.render(time);
    twoObject.render(time);
    cardsObject.render(time);
    freeObject.render(time);
    callObject.render(time);
    backedObject.render(time);
    review1Object.render(time);
    review2Object.render(time);

    renderer.setRenderTarget(renderBack);
    renderer.render(sceneBack, cameraBack);
    postEffect.render(time);

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const on = () => {
    window.addEventListener(
      "resize",
      debounce(() => {
        resizeWindow();
      }),
      1000
    );

    scrollManager.renderNext = () => {
      if (scrollManager.isValidSmooth()) {
        cameraBack.position.y = scrollManager.hookes.contents.velocity[1] * 0.6;
      } else {
        cameraBack.position.y = scrollManager.scrollTop * -1;
      }
    };
  };

  const init = async () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x189aff, 1.0);
    cameraBack.position.z = 800;

    scene.add(postEffect.obj);

    introObject.loadTexture(() => {
      introObject.obj.position.y = canvas.height * 0.33;
      sceneBack.add(introObject.obj);
    });

    titleObject.loadTexture(() => {
      titleObject.obj.position.y = canvas.height * 0.28;
      sceneBack.add(titleObject.obj);
    });

    realObject.loadTexture(() => {
      realObject.obj.position.x = canvas.width * 0.15;
      realObject.obj.position.y = canvas.height * 0.22;
      sceneBack.add(realObject.obj);
    });

    goldObject.loadTexture(() => {
      goldObject.obj.position.z = -100;
      goldObject.obj.position.y = canvas.height * -0.01;
      sceneBack.add(goldObject.obj);
    });

    tiedObject.loadTexture(() => {
      tiedObject.obj.position.x = canvas.width * 0.26;
      tiedObject.obj.position.y = canvas.height * 0.17;
      sceneBack.add(tiedObject.obj);
    });

    priceObject.loadTexture(() => {
      priceObject.obj.position.x = canvas.width * 0.26;
      priceObject.obj.position.y = canvas.height * 0.07;
      sceneBack.add(priceObject.obj);
    });

    limitedObject.loadTexture(() => {
      limitedObject.obj.position.x = canvas.width * 0.26;
      limitedObject.obj.position.y = canvas.height * -0.03;
      sceneBack.add(limitedObject.obj);
    });

    twoObject.loadTexture(() => {
      twoObject.obj.position.x = canvas.width * 0.26;
      twoObject.obj.position.y = canvas.height * -0.09;
      sceneBack.add(twoObject.obj);
    });

    cardsObject.loadTexture(() => {
      cardsObject.obj.position.x = canvas.width * 0.26;
      cardsObject.obj.position.y = canvas.height * -0.14;
      sceneBack.add(cardsObject.obj);
    });

    freeObject.loadTexture(() => {
      freeObject.obj.position.x = canvas.width * 0.26;
      freeObject.obj.position.y = canvas.height * -0.26;
      sceneBack.add(freeObject.obj);
    });

    callObject.loadTexture(() => {
      callObject.obj.position.y = canvas.height * -0.28;
      sceneBack.add(callObject.obj);
    });

    backedObject.loadTexture(() => {
      backedObject.obj.position.x = canvas.width * -0.25;
      backedObject.obj.position.y = canvas.height * 0.12;
      sceneBack.add(backedObject.obj);
    });

    review1Object.loadTexture(() => {
      review1Object.obj.position.x = canvas.width * -0.25;
      review1Object.obj.position.y = canvas.height * -0.03;
      sceneBack.add(review1Object.obj);
    });

    review2Object.loadTexture(() => {
      review2Object.obj.position.x = canvas.width * -0.25;
      review2Object.obj.position.y = canvas.height * -0.14;
      sceneBack.add(review2Object.obj);
    });

    clock.start();

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  };
  init();
}
