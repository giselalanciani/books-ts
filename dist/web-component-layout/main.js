customElements.define(
  "my-paragraph",
  class extends HTMLElement {
    constructor() {
      super();

      //   const template = document.getElementById('my-paragraph');

      // let template = document.createElement("template");      
      // template.innerHTML = `
      //   <style>
      //   p {
      //       color: white;
      //       background-color: green;
      //       padding: 5px;
      //   }
      //   </style>
      //   <p><slot name="my-text">My default text</slot></p>
      // `;

      // const templateContent = template.content;

      // this.attachShadow({ mode: "open" }).appendChild(
      //   templateContent.cloneNode(true)
      // );
    }
  }
);

// const slottedSpan = document.querySelector("my-paragraph span");

// console.log(slottedSpan.assignedSlot);
// console.log(slottedSpan.slot);
