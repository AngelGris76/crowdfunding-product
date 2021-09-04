const MENU_FOCUSABLE_ELEMENTS = ".button-menu, .menu__link";
const DEFAULT_MODAL_FOCUSABLE_ELEMENTS =
  ".modal-pledge__closebutton, #radio-noreward";
const PLEDGE_MODAL_FOCUSABLE_ELEMENTS =
  ".modal-pledge__closebutton, .pledge__radio:checked, .pledge__expandable-input:not([disabled]), .pledge__expandable-button:not([disabled])";
const MAXIMUM_MONEY = 100000;
const root = document.documentElement;
const page = document.querySelector("body");
const stats = page.querySelector(".stats");
const modelArray = page.querySelectorAll(".model");
const mainNav = document.querySelector(".main-nav");
const buttonMenu = document.querySelector(".button-menu");
const menu = document.querySelector(".menu");
const buttonBookmark = document.querySelector(".button--bookmark");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCloseButton = document.querySelector(".modal-pledge__closebutton");
const pledgeArray = modalOverlay.querySelectorAll(".pledge");
const modalSuccessButton = document.querySelector(".modal-success__button");

let lastActiveElement;
let focusables = {};
let bambooStandLeft = parseInt(
  modelArray[0].children[2].children[0].firstChild.textContent
);
let blackEditionLeft = parseInt(
  modelArray[1].children[2].children[0].firstChild.textContent
);
let totalBuyers = parseInt(
  stats.children[0].children[1].firstChild.textContent.replace(",", "")
);
let totalMoney = parseInt(
  stats.children[0].children[0].firstChild.textContent.slice(1).replace(",", "")
);

const generateFocusableElements = (modalContainer, focusableList) => {
  const focusableElementsList = modalContainer.querySelectorAll(focusableList);
  const focusableElements = {
    firstElement: focusableElementsList[0],
    lastElement: focusableElementsList[focusableElementsList.length - 1],
  };
  return focusableElements;
};

const navigateModal = (e, focusables) => {
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === focusables.firstElement) {
      e.preventDefault();
      focusables.lastElement.focus();
    } else if (
      !e.shiftKey &&
      document.activeElement === focusables.lastElement
    ) {
      e.preventDefault();
      focusables.firstElement.focus();
    }
  }
};

const toggleAttribute = (attribute) => {
  if (attribute === "false") return "true";
  if (attribute === "true") return "false";
};

const changeButtonMenuImage = (pressed) => {
  let attribute;
  if (pressed === "true") attribute = "assets/images/icon-close-menu.svg";
  else attribute = "assets/images/icon-hamburger.svg";
  buttonMenu.firstElementChild.setAttribute("src", attribute);
};

const toggleModalOverlay = () => {
  page.classList.toggle("body-overflow--hide");
  modalOverlay.classList.toggle("modal--hide");
};

const toggleMobileMenu = () => {
  toggleModalOverlay();
  mainNav.classList.toggle("main-nav--show");
  menu.classList.toggle("menu--hide");
};

const showModalPledge = () => {
  toggleModalOverlay();
  modalOverlay.firstElementChild.classList.remove("modal--hide");
  modalCloseButton.focus();
};

const unselectPledge = (pledgeToDeselect) => {
  pledgeToDeselect.classList.remove("pledge--selected");
  pledgeToDeselect.children[1].classList.add("pledge__expandable--hide");
  pledgeToDeselect.children[1].children[1].children[0].disabled = true;
  pledgeToDeselect.children[1].children[1].children[1].disabled = true;
};

const selectPledge = (pledgeToSelect) => {
  pledgeToSelect.classList.add("pledge--selected");
  pledgeToSelect.children[1].classList.remove("pledge__expandable--hide");
  pledgeToSelect.children[1].children[1].children[0].disabled = false;
  pledgeToSelect.children[1].children[1].children[1].disabled = false;
};

const cancelModalPledge = () => {
  modalOverlay.firstElementChild.classList.add("modal--hide");
  toggleModalOverlay();
  lastActiveElement.focus();
};

const aceptModalPledge = () => {
  modalOverlay.firstElementChild.classList.add("modal--hide");
  modalOverlay.children[1].classList.remove("modal--hide");
  modalSuccessButton.focus();
};

const closeModalSuccess = () => {
  modalOverlay.children[1].classList.add("modal--hide");
  toggleModalOverlay();
  lastActiveElement.focus();
};

const addThousandSeparator = (stringNumber, separator) => {
  let leftThousand = stringNumber.slice(stringNumber.length - 3);
  let thousandUp = stringNumber.slice(0, stringNumber.length - 3);

  return thousandUp.concat(separator, leftThousand);
};

const refreshLeftData = (dataValue, modelID) => {
  const filteredModel = Array.from(modelArray).filter((element) =>
    element.id.includes(modelID)
  );
  const filteredPledge = Array.from(pledgeArray).filter((element) =>
    element.id.includes(modelID)
  );

  filteredModel[0].children[2].children[0].firstChild.textContent =
    dataValue.toString();
  filteredPledge[0].children[0].children[2].firstChild.textContent =
    dataValue.toString();

  // if left unit === 0, disable product in article and modal
  if (dataValue === 0) {
    filteredModel[0].classList.add("model--disabled");
    filteredModel[0].children[2].children[1].disabled = true;
    filteredModel[0].children[2].children[1].textContent = "Out of stock";
    filteredModel[0].children[2].children[1].classList.add("button--disabled");
    filteredPledge[0].classList.add("pledge--disabled");
    unselectPledge(filteredPledge[0]);
    filteredPledge[0].children[0].children[0].children[0].disabled = true;
    filteredPledge[0].children[0].children[0].children[0].checked = false;
  }
};

page.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("button-menu") ||
    e.target.classList.contains("button-menu__image")
  ) {
    buttonMenu.ariaPressed = toggleAttribute(buttonMenu.ariaPressed);
    buttonMenu.ariaExpanded = toggleAttribute(buttonMenu.ariaExpanded);
    if (buttonMenu.ariaPressed === "true") {
      focusables = generateFocusableElements(mainNav, MENU_FOCUSABLE_ELEMENTS);
    }
    changeButtonMenuImage(buttonMenu.ariaExpanded);
    toggleMobileMenu();
  }

  if (
    e.target.classList.contains("button--bookmark") ||
    e.target.classList.contains("heading__icon-bookmark") ||
    e.target.classList.contains("heading__button-text")
  ) {
    buttonBookmark.classList.toggle("button--bookmark-pressed");
  }

  if (
    (e.target.classList.contains("button--primary") &&
      e.target.classList.contains("heading__button")) ||
    e.target.classList.contains("model__get")
  ) {
    lastActiveElement = document.activeElement;
    focusables = generateFocusableElements(
      modalOverlay,
      DEFAULT_MODAL_FOCUSABLE_ELEMENTS
    );
    showModalPledge();
    if (e.target.classList.contains("model__get")) {
      const stringToSearch = e.target.parentElement.parentElement.id.slice(6);
      const selectedPledge = Array.from(pledgeArray).filter((element) =>
        element.id.includes(stringToSearch)
      );
      selectedPledge[0].children[0].children[0].children[0].click();
    }
  }

  if (
    e.target.classList.contains("modal-pledge__closebutton") ||
    e.target.classList.contains("modal-pledge__closebutton-img")
  ) {
    cancelModalPledge();
  }

  if (e.target.classList.contains("pledge__radio")) {
    const selectedPledge = e.target.parentElement.parentElement.parentElement;
    const previousSelectedPledge = Array.from(pledgeArray).filter((element) =>
      element.classList.contains("pledge--selected")
    );
    if (previousSelectedPledge.length > 0)
      unselectPledge(previousSelectedPledge[0]);

    selectPledge(selectedPledge);
    focusables = generateFocusableElements(
      modalOverlay,
      PLEDGE_MODAL_FOCUSABLE_ELEMENTS
    );
  }

  if (e.target.classList.contains("pledge__expandable-button")) {
    const typeID = e.target.parentElement.parentElement.id.slice(20);
    let barLength;
    e.preventDefault();
    aceptModalPledge();

    if (typeID.includes("bamboo")) {
      if (bambooStandLeft > 0) {
        bambooStandLeft--;
        refreshLeftData(bambooStandLeft, typeID);
      }
    }

    if (typeID.includes("black-edition")) {
      if (blackEditionLeft > 0) {
        blackEditionLeft--;
        refreshLeftData(blackEditionLeft, typeID);
      }
    }

    totalBuyers++;
    stats.children[0].children[1].firstChild.textContent = addThousandSeparator(
      totalBuyers.toString(),
      ","
    );
    totalMoney = totalMoney + parseInt(e.target.previousElementSibling.value);
    stats.children[0].children[0].firstChild.textContent =
      "$" + addThousandSeparator(totalMoney.toString(), ",");
    barLength = ((totalMoney * 100) / 100000).toString() + "%";
    root.style.setProperty("--Bar-percentaje", barLength);

    focusables = generateFocusableElements(
      modalOverlay,
      ".modal-success__button"
    );
  }

  if (e.target.classList.contains("modal-success__button")) {
    closeModalSuccess();
  }
});

mainNav.addEventListener("keydown", (e) => {
  if (buttonMenu.ariaPressed === "true" && e.key === "Escape")
    buttonMenu.click();
  else navigateModal(e, focusables);
});

modalOverlay.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    !focusables["firstElement"].classList.contains("modal-success__button")
  )
    modalCloseButton.click();
  else navigateModal(e, focusables);
});
