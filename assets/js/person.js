import Hello from './web-components/hello'

import Publication from './web-components/publication'
import PublicationList from './web-components/publication-list'

/*
/// how to initialize with existing content?
const PersonHeader = (props) => {
    return (
        <div></div>
    )
}

// use hydrate function ?
ReactDOM.render(
  <PersonHeader />,
  document.getElementById('sticky-header')
);

vstf-staging
vstf-person-publication-resolver
*/

/*

$(document).ready(function() {


});

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = $("#myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.addClass("sticky");
    //header.classList.add("sticky");
  } else {
    header.removeClass("sticky");
    //header.classList.remove("sticky");
  }
} 
*/