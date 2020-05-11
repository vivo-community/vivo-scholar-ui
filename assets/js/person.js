// person entity page behavior
const grantList = document.getElementById('grant-list');
if (grantList) {
  grantList.sorts = [
    {property : "startDate", direction : "asc", label: "Oldest First"} ,
    {property : "startDate", direction : "desc", label: "Newest First"},
    {property : "title", direction : "asc", label: "Grant a-z"} ,
    {property : "title", direction : "desc", label: "Grant z-a"}
  ];
}

const pubList = document.getElementById('publication-list');
if (pubList) {
  pubList.sorts = [
    {property : "publishedDate", direction : "asc", label: "Oldest First"} ,
    {property : "publishedDate", direction : "desc", label: "Newest First"},
    {property : "title", direction : "asc", label: "Publication a-z"} ,
    {property : "title", direction : "desc", label: "Publication z-a"}
  ];
}

const courseList = document.getElementById('course-list');
if (courseList) {
  courseList.sorts = [
    {property : "title", direction : "asc", label: "Course a-z"} ,
    {property : "title", direction : "desc", label: "Course z-a"}
  ];
}

const screenWidth = window.innerWidth;
if (screenWidth < 800) {
  document.getElementById("contact-info").setAttribute("hidden", true);
  document.getElementById("person-contact").removeAttribute("hidden");
}
