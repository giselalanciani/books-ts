// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { IAuthor } from "../../models/author";
import { AuthorsService } from "../../services/authors-service";
import { DateService } from "../../services/date-service";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateAuthorsController {
  constructor(
    private authorsService: AuthorsService,
    private dateService: DateService
  ) {
    const createAuthorButton = document.getElementById("create-author-button");
    createAuthorButton?.addEventListener(
      "click",
      this.onClickCreateAuthorButton
    );
  }
  private renderDays = (daysDataList: number[]) => {
    const authorDaySelect = document.getElementById("day");
    const dayTemplate = <HTMLTemplateElement>(
      document.getElementById("day-template")
    );

    for (let i = 0; i < daysDataList.length; i++) {
      const copyDayTemplate = document.importNode(dayTemplate?.content, true);

      const daysOption = copyDayTemplate.querySelector("option");
      if (daysOption !== null) {
        daysOption.textContent = `${daysDataList[i]}`;
        daysOption?.setAttribute("value", `${daysDataList[i]}`);
        authorDaySelect?.append(daysOption);
      }
    }
  };

  private renderYears = (yearsDataList: number[]) => {
    const authorYearSelect = document.getElementById("year");
    const yearTemplate = <HTMLTemplateElement>(
      document.getElementById("year-template")
    );

    for (let i = 0; i < yearsDataList.length; i++) {
      const copyYearTemplate = document.importNode(yearTemplate?.content, true);

      const yearsOption = copyYearTemplate.querySelector("option");
      if (yearsOption !== null) {
        yearsOption.textContent = `${yearsDataList[i]}`;
        yearsOption?.setAttribute("value", `${yearsDataList[i]}`);

        authorYearSelect?.append(yearsOption);
      }
    }
  };

  private renderMonths = (monthsDataList: number[]) => {
    const authorMonthSelect = document.getElementById("month");
    const monthTemplate = <HTMLTemplateElement>(
      document.getElementById("month-template")
    );

    for (let i = 0; i < monthsDataList.length; i++) {
      const copyMonthTemplate = document.importNode(
        monthTemplate?.content,
        true
      );

      const monthOption = copyMonthTemplate.querySelector("option");
      if (monthOption !== null) {
        monthOption.textContent = `${monthsDataList[i]}`;
        monthOption.setAttribute("value", `${monthsDataList[i]}`);

        authorMonthSelect?.append(monthOption);
      }
    }
  };

  private validateCreateForm() {
    let isFormValid = true;
    if (validateFieldRequired("authorname") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("year") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("month") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("day") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private onClickCreateAuthorButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateForm() === true) {
      this.sendAuthorsData();
    }
  };

  private sendAuthorsData = async () => {
    const authorNameInputElement = <HTMLInputElement>(
      document.querySelector("[name='authorname']")
    );

    const birthdateYearSelectElement = <HTMLSelectElement>(
      document.querySelector("[name='year']")
    );
    const birthdateMonthSelectElement = <HTMLSelectElement>(
      document.querySelector("[name='month']")
    );
    const birthdateDaySelectElement = <HTMLSelectElement>(
      document.querySelector("[name='day']")
    );

    const year = birthdateYearSelectElement.value;
    const month = birthdateMonthSelectElement.value;
    const day = birthdateDaySelectElement.value;

    const birthdate = new Date(parseInt(year), parseInt(month), parseInt(day));

    const author: IAuthor = {
      id: "",
      name: authorNameInputElement.value,
      birthdate: birthdate.toISOString(),
    };

    try {
      await this.authorsService.createAuthor(author);

      alert("Autor creado");
      window.location.href = "/authors";
    } catch (error) {
      errorHandler("No se pudo crear el autor, intente mas tarde.", error);
    }
  };

  public async init() {
    const daysData = await this.dateService.getDays();
    const yearsData = await this.dateService.getYears();
    const monthsData = await this.dateService.getMonths();

    this.renderDays(daysData);
    this.renderYears(yearsData);
    this.renderMonths(monthsData);
  }
}

const createAuthorsCtrl = new CreateAuthorsController(
  new AuthorsService(),
  new DateService()
);
createAuthorsCtrl.init();
