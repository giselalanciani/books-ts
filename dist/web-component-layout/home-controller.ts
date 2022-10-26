class HomeController {
  constructor() {
    console.log("home controller");
  }
}
const homeCtrl = new HomeController();




customElements.define(
  "app-content",
  class extends HTMLElement {
    constructor() {
      super();

      //   const template = document.getElementById('my-paragraph');

      let template = document.createElement("template");      
      template.innerHTML = `
      <style>
        iframe {
          width: 100%;
          height: 100%;
          border-width: 0;
        }
        </style>
        <iframe src="/login"></iframe>
      `;
      
      const templateContent = template.content;

      this.attachShadow({ mode: "open" }).appendChild(
        templateContent.cloneNode(true)
      );
    }
  }
);