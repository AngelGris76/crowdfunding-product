const MENU_FOCUSABLE_ELEMENTS = ".button-menu, .menu__link";
const MODAL_FOCUSABLE_ELEMENTS = ".modal-pledge__closebutton, #radio-noreward";

const page = document.querySelector("body");
const mainNav = document.querySelector(".main-nav");
const buttonMenu = document.querySelector(".button-menu");
const menu = document.querySelector(".menu");
const buttonBookmark = document.querySelector(".button--bookmark");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCloseButton = document.querySelector(".modal-pledge__closebutton");
const pledgeArray = modalOverlay.querySelectorAll(".pledge");
const pledgeRadioButtonArray = modalOverlay.querySelectorAll(".pledge__radio");
const modalSuccessButton = document.querySelector(".modal-success__button");

let lastActiveElement;
let firstFocusableElement;
let lastFocusableElement;

const generateFocusableElements = (modalContainer, focusableList) => {
  const focusableElements = modalContainer.querySelectorAll(focusableList);
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];
};

const iterateModal = (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === firstFocusableElement) {
      e.preventDefault();
      lastFocusableElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
      e.preventDefault();
      firstFocusableElement.focus();
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

const unselectPledge = () => {
  pledgeArray.forEach((item) => {
    item.classList.remove("pledge--selected");
    item.children[1].classList.add("pledge__expandable--hide");
    item.children[1].children[1].children[0].disabled = true;
    item.children[1].children[1].children[1].disabled = true;
  });
};

const selectPledge = (index) => {
  pledgeArray[index].classList.add("pledge--selected");
  pledgeArray[index].children[1].classList.remove("pledge__expandable--hide");
  pledgeArray[index].children[1].children[1].children[0].disabled = false;
  pledgeArray[index].children[1].children[1].children[1].disabled = false;
  let focusableList =
    ".modal-pledge__closebutton, .pledge__radio:checked, .pledge__expandable-input:not([disabled]), .pledge__expandable-button:not([disabled])";
  generateFocusableElements(modalOverlay, focusableList);
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

page.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("button-menu") ||
    e.target.classList.contains("button-menu__image")
  ) {
    buttonMenu.ariaPressed = toggleAttribute(buttonMenu.ariaPressed);
    buttonMenu.ariaExpanded = toggleAttribute(buttonMenu.ariaExpanded);
    if (buttonMenu.ariaPressed === "true") {
      generateFocusableElements(mainNav, MENU_FOCUSABLE_ELEMENTS);
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
    generateFocusableElements(modalOverlay, MODAL_FOCUSABLE_ELEMENTS);
    showModalPledge();
  }

  if (
    e.target.classList.contains("modal-pledge__closebutton") ||
    e.target.classList.contains("modal-pledge__closebutton-img")
  ) {
    cancelModalPledge();
  }

  if (e.target.classList.contains("pledge__radio")) {
    for (let index = 0; index < pledgeRadioButtonArray.length; index++) {
      if (pledgeRadioButtonArray[index].checked) {
        unselectPledge();
        selectPledge(index);
      }
    }
  }

  if (e.target.classList.contains("pledge__expandable-button")) {
    e.preventDefault();
    aceptModalPledge();
  }

  if (e.target.classList.contains("modal-success__button")) {
    closeModalSuccess();
  }
});

mainNav.addEventListener("keydown", (e) => {
  if (buttonMenu.ariaPressed === "true" && e.key === "Escape")
    buttonMenu.click();
  else iterateModal(e);
});

modalOverlay.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modalCloseButton.click();
  else iterateModal(e);
});
