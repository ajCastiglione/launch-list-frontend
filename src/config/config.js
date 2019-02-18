export let url;

if (window.location.href.includes("localhost")) {
  url = "localhost:5000";
} else {
  url = "minerva-checklist.herokuapp.com";
}

export let uptimeUrl;
if (window.location.href.includes("localhost")) {
  uptimeUrl = "//localhost:5050";
} else {
  uptimeUrl = "";
}
