let url;

if (window.location.href.includes("localhost")) {
  url = "localhost:5000";
} else {
  url = "https://minerva-checklist.herokuapp.com";
}

export default url;