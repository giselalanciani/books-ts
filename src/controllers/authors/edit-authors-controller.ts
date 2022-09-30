import { IAuthor } from "../../models/author";
import { AuthorsService } from "../../services/authors-service";
import { DateService } from "../../services/date-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditAuthorsController {
  authorService;
  dateService;
  constructor(authorService: AuthorsService, dateService: DateService) {
    this.authorService = authorService;
    this.dateService = dateService;

    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-author-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("authorname");
    configureValidator("year");
    configureValidator("month");
    configureValidator("day");
  }

  getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  onClickSaveButton = async (event: Event) => {
    if (this.validateEditAuthorsForm() === true) {
      const authorInput = <HTMLInputElement>(
        document.querySelector("[name='authorname']")
      );
      const yearSelect = <HTMLSelectElement>(
        document.querySelector("[name='year']")
      );
      const monthSelect = <HTMLSelectElement>(
        document.querySelector("[name='month']")
      );
      const daySelect = <HTMLSelectElement>(
        document.querySelector("[name='day']")
      );

      const author: IAuthor = {
        id: "",
        name: authorInput.value,
        birthdate: (new Date(
          parseInt(yearSelect.value),
          parseInt(monthSelect.value),
          parseInt(daySelect.value)
        )).toISOString(),
      };

      const id = this.getQueryParams().id;

      try {
        const updateAuthorResponseData = await this.authorService.updateAuthor(
          id,
          author
        );
        alert("Su autor fue guardado correctamente");
        window.location.href = "/authors";
      } catch (error) {
        errorHandler("No se pudo guardar autor", error);
      }
    }
  };

  async init() {
    const params = this.getQueryParams();
    const id = params.id;

    try {
      const authorData = await this.authorService.getAuthor(id);

      const yearsList = this.dateService.getYears();
      const monthsList = this.dateService.getMonths();
      const daysList = this.dateService.getDays();

      this.renderYears(yearsList);
      this.renderMonths(monthsList);
      this.renderDays(daysList);

      // const birthdate = await this.dateService

      const authorInput = <HTMLInputElement>(
        document.querySelector("[name='authorname']")
      );
      authorInput.value = authorData.name;

      const birthdate = new Date(authorData.birthdate);

      const yearSelect = <HTMLSelectElement>(
        document.querySelector("[name='year']")
      );
      yearSelect.value = birthdate.getFullYear().toString();      

      const monthSelect = <HTMLSelectElement>(
        document.querySelector("[name='month']")
      );      
      monthSelect.value = birthdate.getMonth().toString();
      const daySelect = <HTMLSelectElement>(
        document.querySelector("[name='day']")
      );      
      daySelect.value = birthdate.getDate().toString();
    } catch (error) {
      errorHandler(
        "No se pudo traer la informacion de autor, intente mas tarde",
        error
      );
    }
  }

  validateEditAuthorsForm() {
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

  renderDays = (daysDataList: number[]) => {
    const authorDaySelect = <HTMLSelectElement>document.getElementById("day");
    const dayTemplate = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < daysDataList.length; i++) {
      const copyDayTemplate = document.importNode(dayTemplate.content, true);

      const daysOption = <HTMLOptionElement>(
        copyDayTemplate.querySelector("option")
      );

      daysOption.textContent = `${daysDataList[i]}`;
      daysOption.setAttribute("value", `${daysDataList[i]}`);

      authorDaySelect.append(daysOption);
    }
  };

  renderYears = (yearsDataList: number[]) => {
    const authorYearSelect = <HTMLSelectElement>document.getElementById("year");
    const yearTemplate = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < yearsDataList.length; i++) {
      const copyYearTemplate = document.importNode(yearTemplate.content, true);

      const yearsOption = <HTMLOptionElement>(
        copyYearTemplate.querySelector("option")
      );

      yearsOption.textContent = `${yearsDataList[i]}`;
      yearsOption.setAttribute("value", `${yearsDataList[i]}`);

      authorYearSelect.append(yearsOption);
    }
  };

  renderMonths = (monthsDataList: number[]) => {
    const authorMonthSelect = <HTMLSelectElement>(
      document.getElementById("month")
    );
    const monthTemplate = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < monthsDataList.length; i++) {
      const copyMonthTemplate = document.importNode(
        monthTemplate.content,
        true
      );

      const monthOption = <HTMLOptionElement>(
        copyMonthTemplate.querySelector("option")
      );

      monthOption.textContent = `${monthsDataList[i]}`;
      monthOption.setAttribute("value", `${monthsDataList[i] - 1}`);

      authorMonthSelect.append(monthOption);
    }
  };
}
const editAuthorsCtrl = new EditAuthorsController(
  new AuthorsService(),
  new DateService()
);
editAuthorsCtrl.init();
