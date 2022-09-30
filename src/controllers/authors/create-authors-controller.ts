import { IAuthor } from "../../models/author";
import { AuthorsService } from "../../services/authors-service";
import { DateService } from "../../services/date-service";
import { errorHandler } from "../../utils/error-handler";

class CreateAuthorsController {
  authorsService;
  dateService;
  constructor(authorsService: AuthorsService, dateService: DateService) {
    this.authorsService = authorsService;
    this.dateService = dateService;

    const createAuthorButton = document.getElementById("create-author-button");
    createAuthorButton?.addEventListener(
      "click",
      this.onClickCreateAuthorButton
    );
  }
  renderDays = (daysDataList: number[]) => {
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

  renderYears = (yearsDataList: number[]) => {
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

  renderMonths = (monthsDataList: number[]) => {
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

  validateFieldRequired(fieldName: string) {
    const authorNameInput = <HTMLInputElement>(
      document.querySelector(`[name='${fieldName}']`)
    );
    const authorNameRequiredError = document.querySelector(
      `[name='${fieldName}-required']`
    );
    if (authorNameInput.value == "") {
      authorNameRequiredError?.classList.remove("hidden");
      return false;
    }
    authorNameRequiredError?.classList.add("hidden");
    return true;
  }

  validateCreateForm() {
    let isFormValid = true;

    if (this.validateFieldRequired("authorname") === false) {
      isFormValid = false;
    }
    if (this.validateFieldRequired("year") === false) {
      isFormValid = false;
    }
    if (this.validateFieldRequired("month") === false) {
      isFormValid = false;
    }
    if (this.validateFieldRequired("day") === false) {
      isFormValid = false;
    }

    return isFormValid;

    // this.validateFieldRequired("authorname");

    // this.validateFieldRequired("year");

    // const yearNameInput = document.querySelector("[name='yearname']");
    // const nameRequiredError = document.querySelector(
    //   "[name='yearname-required']"
    // );
    // if (yearNameInput.value == "") {
    //   nameRequiredError.classList.remove("hidden");
    //   return false;
    // }

    // nameRequiredError.classList.add("hidden");
    // return true;
  }

  onClickCreateAuthorButton = () => {
    if (this.validateCreateForm() === true) {
      this.sendAuthorsData();
    }
  };

  sendAuthorsData = async () => {
    const authorNameInput = <HTMLInputElement>(
      document.querySelector("[name='authorname']")
    );

    const birthdateYearSelect = <HTMLSelectElement>(
      document.querySelector("[name='year']")
    );
    const birthdateMonthSelect = <HTMLSelectElement>(
      document.querySelector("[name='month']")
    );
    const birthdateDaySelect = <HTMLSelectElement>(
      document.querySelector("[name='day']")
    );

    const year = birthdateYearSelect.value;
    const month = birthdateMonthSelect.value;
    const day = birthdateDaySelect.value;

    const birthdate = new Date(parseInt(year), parseInt(month), parseInt(day));

    const author: IAuthor = {
      id: "",
      name: authorNameInput.value,
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

  async init() {
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
