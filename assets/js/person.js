const screenWidth = window.innerWidth;
if (screenWidth < 800) {
  document.getElementById("contact-info").setAttribute("hidden", true);
  document.getElementById("person-contact").removeAttribute("hidden");
}
