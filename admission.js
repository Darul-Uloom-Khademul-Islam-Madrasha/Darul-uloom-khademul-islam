const form = document.querySelector('form');
let stdList = document.querySelector('.stdList');
let studentID = 0;
const inputData = {
  details: {}
};
const dynamicObj = {};


window.onclick = () => {
  stdList.innerHTML = Object.values(JSON.parse(localStorage.getItem("stdList")));
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  studentID++;

  for (let i = 0; i < form.length - 2; i++) {

    inputData.details["input" + (i + 1)] = form[i].value;


    Object.defineProperty(dynamicObj, inputData.details.input1, {
      value: inputData.details,
      writable: true,
      enumerable: true,
      configurable: true
    });
    console.log(dynamicObj)

  }


  localStorage.setItem("stdList",JSON.stringify(dynamicObj));



});