const input = document.querySelector("#input");
const submitBtn = document.querySelector(".shorten-btn");
const span = document.querySelector(".link-input span");
const copyBtns = document.querySelectorAll(".copyText");
const btnErr = document.querySelector(".link-input button");
let links = [];
const fill = (elem) => {
  let link = elem.link;
  if (link.length > 50) link = elem.link.slice(0, 50) + "...";
  let el = `
              <div class="link">
              <p>${link}</p>
          <div class="short-link">
              <a href="">${elem.shortlink}</a>
              <button class="copyText">Copy</button>
              <a href="#" class="delete"><i class="fas fa-trash"></i></a>
          </div>
          </div>
      `;
  document.querySelector(".short-link-container").innerHTML += el;
};

if (localStorage.getItem("short-links") !== null) {
  JSON.parse(localStorage.getItem("short-links")).forEach((element) => {
    fill(element);
  });
}
submitBtn.addEventListener("click", () => {
  let val = input.value;
  if (val.length == 0) {
    input.classList.add("error");
    span.classList.add("error");
    btnErr.classList.add("error");
  } else {
    shortenLink(val);
  }
});

document.querySelector("body").addEventListener("click", function (e) {
  if (e.target.className == "copyText") {
    let btn = e.target;
    btn.innerText = "Copied!";
    btn.classList.add("active");
    selectText();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    setTimeout(() => {
      btn.innerText = "Copy";
      btn.classList.remove("active");
    }, 3000);
  }
});

const selectText = () => {
  var element = event.target.parentElement.children[0];
  let range;
  if (document.selection) {
    // IE
    range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
};

const shortenLink = (link) => {
  let linkRequest = {
    destination: link,
    domain: { fullName: "rebrand.ly" },
  };

  fetch("https://api.rebrandly.com/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: "fd9db85009034204b37f02732db051dd",
    },
    body: JSON.stringify(linkRequest),
  })
    .then((response) => response.json())
    .then((data) => {
      let element = `
        <div class="link">
        <p>${link}</p>
       <div class="short-link">
         <a href="">${data.shortUrl}</a>
         <button class="copyText">Copy</button>
         <a href="#" class="delete"><i class="fas fa-trash"></i></a>
       </div>
     </div>
        `;

      document.querySelector(".short-link-container").innerHTML += element;
      input.classList.remove("error");
      span.classList.remove("error");
      btnErr.classList.remove("error");
      input.value = "";
      let newData = { link: link, shortlink: data.shortUrl };
      let localData = localStorage.getItem("short-links");
      if (localData !== null) {
        let oldData = JSON.parse(localStorage.getItem("short-links"));
        oldData = [...oldData, newData];
        localStorage.setItem("short-links", JSON.stringify(oldData));
      } else {
        localStorage.setItem("short-links", JSON.stringify([newData]));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

document.querySelector("body").addEventListener("click", function (e) {
  if (e.target.className === "fas fa-trash") {
    e.preventDefault();
    let parent = e.target.parentElement.parentElement;
    let links = JSON.parse(localStorage.getItem("short-links"));
    links = links.filter((l) => l.shortlink !== parent.children[0].innerHTML);
    parent.parentElement.remove();
    localStorage.setItem("short-links", JSON.stringify(links));
  }
});

/** toggle nav bar on mobile screen size **/
const ul = document.querySelector(".header-container nav ul");
let state = false;
document.querySelector("#dropDown").addEventListener("click", (e) => {
  e.preventDefault();
  state = !state;
  updateImage();
});

const updateImage = () => {
  if (state) {
    ul.classList.add("active");
  } else {
    ul.classList.remove("active");
  }
};

document.querySelectorAll(".getStarted").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    input.focus();
  });
});
