import { IAuthor } from "../../models/author";
import { AuthorsService } from "../../services/authors-service";
import { DateService } from "../../services/date-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditAuthorsController {
  constructor(
    private authorService: AuthorsService,
    private dateService: DateService
  ) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-author-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("authorname");
    configureValidator("year");
    configureValidator("month");
    configureValidator("day");
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditAuthorsForm() === true) {
      const authorInputElement = <HTMLInputElement>(
        document.querySelector("[name='authorname']")
      );
      const yearSelectElement = <HTMLSelectElement>(
        document.querySelector("[name='year']")
      );
      const monthSelectElement = <HTMLSelectElement>(
        document.querySelector("[name='month']")
      );
      const daySelectElement = <HTMLSelectElement>(
        document.querySelector("[name='day']")
      );

      const author: IAuthor = {
        id: "",
        name: authorInputElement.value,
        birthdate: new Date(
          parseInt(yearSelectElement.value),
          parseInt(monthSelectElement.value),
          parseInt(daySelectElement.value)
        ).toISOString(),
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

  public async init() {
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

  private validateEditAuthorsForm() {
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

  private renderDays = (daysDataList: number[]) => {
    const authorDaySelectElement = <HTMLSelectElement>document.getElementById("day");
    const dayTemplateElement = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < daysDataList.length; i++) {
      const copyDayTemplate = document.importNode(dayTemplateElement.content, true);

      const daysOption = <HTMLOptionElement>(
        copyDayTemplate.querySelector("option")
      );

      daysOption.textContent = `${daysDataList[i]}`;
      daysOption.setAttribute("value", `${daysDataList[i]}`);

      authorDaySelectElement.append(daysOption);
    }
  };

  private renderYears = (yearsDataList: number[]) => {
    const authorYearSelectElement = <HTMLSelectElement>document.getElementById("year");
    const yearTemplateElement = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < yearsDataList.length; i++) {
      const copyYearTemplate = document.importNode(yearTemplateElement.content, true);

      const yearsOption = <HTMLOptionElement>(
        copyYearTemplate.querySelector("option")
      );

      yearsOption.textContent = `${yearsDataList[i]}`;
      yearsOption.setAttribute("value", `${yearsDataList[i]}`);

      authorYearSelectElement.append(yearsOption);
    }
  };

  private renderMonths = (monthsDataList: number[]) => {
    const authorMonthSelectElement = <HTMLSelectElement>(
      document.getElementById("month")
    );
    const monthTemplateElement = <HTMLTemplateElement>(
      document.getElementById("date-option-template")
    );

    for (let i = 0; i < monthsDataList.length; i++) {
      const copyMonthTemplate = document.importNode(
        monthTemplateElement.content,
        true
      );

      const monthOption = <HTMLOptionElement>(
        copyMonthTemplate.querySelector("option")
      );

      monthOption.textContent = `${monthsDataList[i]}`;
      monthOption.setAttribute("value", `${monthsDataList[i] - 1}`);

      authorMonthSelectElement.append(monthOption);
    }
  };
}
const editAuthorsCtrl = new EditAuthorsController(
  new AuthorsService(),
  new DateService()
);
editAuthorsCtrl.init();
