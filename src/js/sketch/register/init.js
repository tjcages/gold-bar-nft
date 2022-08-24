const THREE = require("three");
const { debounce } = require("@ykob/js-util");
const { registerToDatabase } = require("../../firebase")

const SmoothScrollManager =
  require("../../smooth_scroll_manager/SmoothScrollManager").default;
const Ground = require("./Ground").default;
const Debris = require("./Debris").default;
const PostEffect = require("./PostEffect").default;

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
  const texLoader = new THREE.TextureLoader();
  const ground = new Ground();
  const debris = [
    new Debris(200, -500, 200),
    new Debris(-350, -600, -50),
    new Debris(-150, -700, -150),
    new Debris(-500, -900, 0),
    new Debris(100, -1100, 250),
    new Debris(-100, -1200, -300),
    new Debris(150, -1500, -100),
  ];
  const postEffect = new PostEffect(renderBack.texture);
  const registerScroll = document.getElementById("registerScroll");
  const elemIntro = document.getElementsByClassName("js-transition-intro");
  const registerButton = document.getElementById("submit");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const companyInput = document.getElementById("company");
  const titleInput = document.getElementById("title");
  const typeSelect = document.getElementById("type");
  const successMessage = document.getElementById("success");

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
    ground.render(time);
    for (var i = 0; i < debris.length; i++) {
      debris[i].render(time);
    }
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
  const transitionOnload = () => {
    for (var i = 0; i < elemIntro.length; i++) {
      const elm = elemIntro[i];
      elm.classList.add("is-shown");
    }

    registerScroll.addEventListener("click", function () {
      var register = document.querySelector("#register");
      register.scrollIntoView({ behavior: "smooth", block: "end" });

      // hide register scroll button
      setTimeout(function () {
        registerScroll.classList.remove("is-shown");
      }, 400);
    });

    registerButton.addEventListener("click", function () {
      var goodToGo = true;
      // check name input
      if (nameInput.value == "") {
        nameInput.classList.add("is-error");
        goodToGo = false;
      } else {
        nameInput.classList.remove("is-error");
      }
      // check email input
      if (emailInput.value == "") {
        emailInput.classList.add("is-error");
        goodToGo = false;
      } else {
        emailInput.classList.remove("is-error");
      }
      // check company input
      if (companyInput.value == "") {
        companyInput.classList.add("is-error");
        goodToGo = false;
      } else {
        companyInput.classList.remove("is-error");
      }
      // check title input
      if (titleInput.value == "") {
        titleInput.classList.add("is-error");
        goodToGo = false;
      } else {
        titleInput.classList.remove("is-error");
      }
      // check type select
      if (typeSelect.value == "") {
        typeSelect.classList.add("is-error");
        goodToGo = false;
      } else {
        typeSelect.classList.remove("is-error");
      }
      if (goodToGo) {
        // submit registration & clear
        successMessage.classList.add("is-shown");

        const application = {
          name: nameInput.value,
          email: emailInput.value,
          company: companyInput.value,
          title: titleInput.value,
          type: typeSelect.value
        }

        registerToDatabase(application)

        nameInput.value = "";
        emailInput.value = "";
        companyInput.value = "";
        titleInput.value = "";
        typeSelect.value = "";
      }
    });
  };

  const init = async () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.position.z = 800;

    scene.add(postEffect.obj);
    sceneBack.add(ground.obj);

    clock.start();

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  };
  init();
}
