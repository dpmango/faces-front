export default function photo(url) {

  // if( url.url.indexOf("https") == 0 ) {
  //   // use proxy if it begins with http
  //   return `${window.location.protocol}//${window.location.host}/photo?url=${encodeURIComponent(url.url)}`;
  // } else {
  //   return url.url;
  // }

  return url.url;
}
