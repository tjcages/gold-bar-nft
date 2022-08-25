const THREE = require("three");
const { debounce } = require("@ykob/js-util");
const { registerEventDetailsToDatabase } = require("../../firebase");

const SmoothScrollManager =
  require("../../smooth_scroll_manager/SmoothScrollManager").default;
const TitleObject = require("./TitleObject").default;
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
  const ground = new Ground();
  const titleObject = new TitleObject();
  const debris = [
    new Debris(200, -500, 200),
    new Debris(-350, -600, -50),
    new Debris(-150, -800, -150),
    new Debris(400, -900, 0),
    new Debris(100, -1100, 250),
    new Debris(-100, -1200, -300),
    new Debris(150, -1500, -100),
  ];
  const postEffect = new PostEffect(renderBack.texture);
  const elemIntro = document.getElementsByClassName("js-transition-intro");

  const nameInput = document.getElementById("name");
  const companyInput = document.getElementById("company");
  const emailInput = document.getElementById("email");
  const socialInput = document.getElementById("social");

  const eventTitleInput = document.getElementById("event-title");
  const eventDateInput = document.getElementById("event-date");
  const eventLocationInput = document.getElementById("event-location");
  const capacitySelect = document.getElementById("capacity");
  const eventLinkInput = document.getElementById("event-link");
  const eventDescriptionInput = document.getElementById("event-description");

  const registerButton = document.getElementById("submit");
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
    titleObject.render(time);
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

    registerButton.addEventListener("click", function () {
      var goodToGo = true;
      console.log("Clicking");
      // check name input
      if (nameInput.value == "") {
        nameInput.classList.add("is-error");
        goodToGo = false;
      } else {
        nameInput.classList.remove("is-error");
      }
      // check company input
      if (companyInput.value == "") {
        companyInput.classList.add("is-error");
        goodToGo = false;
      } else {
        companyInput.classList.remove("is-error");
      }
      // check email input
      if (emailInput.value == "") {
        emailInput.classList.add("is-error");
        goodToGo = false;
      } else {
        emailInput.classList.remove("is-error");
      }
      // check social input
      if (socialInput.value == "") {
        socialInput.classList.add("is-error");
        goodToGo = false;
      } else {
        socialInput.classList.remove("is-error");
      }
      // check event title input
      if (eventTitleInput.value == "") {
        eventTitleInput.classList.add("is-error");
        goodToGo = false;
      } else {
        eventTitleInput.classList.remove("is-error");
      }
      // check event date input
      if (eventDateInput.value == "") {
        eventDateInput.classList.add("is-error");
        goodToGo = false;
      } else {
        eventDateInput.classList.remove("is-error");
      }
      // check event location input
      if (eventLocationInput.value == "") {
        eventLocationInput.classList.add("is-error");
        goodToGo = false;
      } else {
        eventLocationInput.classList.remove("is-error");
      }
      // check event capacity select
      if (capacitySelect.value == "") {
        capacitySelect.classList.add("is-error");
        goodToGo = false;
      } else {
        capacitySelect.classList.remove("is-error");
      }
      // check event description input
      if (eventDescriptionInput.value == "") {
        eventDescriptionInput.classList.add("is-error");
        goodToGo = false;
      } else {
        eventDescriptionInput.classList.remove("is-error");
      }

      if (goodToGo) {
        // submit registration & clear
        successMessage.classList.add("is-shown");

        const event = {
          name: nameInput.value,
          company: companyInput.value,
          email: emailInput.value,
          social: socialInput.value,
          eventTitle: eventTitleInput.value,
          eventDate: eventDateInput.value,
          eventLocation: eventLocationInput.value,
          eventCapacity: capacitySelect.value,
          eventLink: eventLinkInput.value ?? "",
          eventDescription: eventDescriptionInput.value,
        };

        registerEventDetailsToDatabase(event);

        nameInput.value = "";
        companyInput.value = "";
        emailInput.value = "";
        socialInput.value = "";
        eventTitleInput.value = "";
        eventDateInput.value = "";
        eventLocationInput.value = "";
        capacitySelect.value = "";
        eventLinkInput.value = "";
        eventDescriptionInput.value = "";
      }
    });
  };

  const init = async () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.position.z = 800;

    scene.add(postEffect.obj);
    sceneBack.add(ground.obj);

    titleObject.loadTexture(() => {
      sceneBack.add(titleObject.obj);
      // sceneBack.add(skyOctahedron.obj);
      // sceneBack.add(skyOctahedronShell.obj);
      for (var i = 0; i < debris.length; i++) {
        sceneBack.add(debris[i].obj);
      }
      transitionOnload();
    });

    clock.start();

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  };
  init();
}
