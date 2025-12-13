window.onload = function () {
  layui.use("flow", function () {
    var flow = layui.flow;
    flow.lazyimg();
  });
  var menuBtn = document.querySelector(".menu-btn");
  var menuBox = document.querySelector(".menu");
  var menuCloseBtn = document.querySelector(".menu-close");
  var searchBtn = document.querySelector(".search-btn");
  var searchCloseBtn = document.querySelector(".search-close");
  var searchBox = document.querySelector(".search");
  var searchInner = document.querySelector(".search .inner");
  var searchSubmit = document.querySelector(".search-submit");
  var showMenu = false;
  var showSearch = false;

  menuBtn.addEventListener(
    "click",
    function () {
      this.classList.toggle("is-active");
      menuBox.classList.toggle("show");
      showMenu = !showMenu;
      if (showMenu) {
        if (showSearch) {
          searchBox.classList.toggle("show");
        }
        disableBackgroundScroll();
      } else {
        enableBackgroundScroll();
      }
    },
    false
  );
  menuCloseBtn.addEventListener(
    "click",
    function () {
      menuBtn.classList.toggle("is-active");
      menuBox.classList.toggle("show");
      showMenu = !showMenu;
      if (showMenu) {
        if (showSearch) {
          searchBox.classList.toggle("show");
        }
        disableBackgroundScroll();
      } else {
        enableBackgroundScroll();
      }
    },
    false
  );
  menuBox.addEventListener(
    "click",
    function () {
      if (showMenu) {
        menuBtn.click();
      }
    },
    false
  );
  searchBtn.addEventListener(
    "click",
    function () {
      searchBox.classList.toggle("show");
      showSearch = !showSearch;
      if (showSearch) {
        if (showMenu) {
          menuBox.classList.toggle("show");
          menuBtn.classList.toggle("is-active");
        }
        disableBackgroundScroll();
      } else {
        enableBackgroundScroll();
      }
    },
    false
  );
  searchCloseBtn.addEventListener(
    "click",
    function () {
      searchBox.classList.toggle("show");
      showSearch = !showSearch;
      if (showSearch) {
        if (showMenu) {
          menuBox.classList.toggle("show");
          menuBtn.classList.toggle("is-active");
        }
        disableBackgroundScroll();
      } else {
        enableBackgroundScroll();
      }
    },
    false
  );
  searchInner.addEventListener(
    "click",
    function (event) {
      event.stopPropagation();
    },
    false
  );

  searchBox.addEventListener(
    "click",
    function () {
      if (showSearch) {
        searchBtn.click();
      }
    },
    false
  );
  searchSubmit.addEventListener(
    "click",
    function () {
      searchBtn.click();
    },
    false
  );

  function disableBackgroundScroll() {
    $("body").css("overflow", "hidden");
    $(window).bind("touchmove", function (e) {
      e.preventDefault();
    });
    $(window).bind("mousewheel", function (e) {
      e.preventDefault();
    });
  }
  function enableBackgroundScroll() {
    $("body").css("overflow", "auto");
    $(window).unbind("touchmove");
    $(window).unbind("mousewheel");
  }

  // Normalize page title to kanizaa.com
  if (typeof document !== "undefined" && document.title) {
    var currentTitle = document.title.trim();
    if (currentTitle.toLowerCase() === "chromegame") {
      document.title = "kanizaa.com";
    }
  }
};
