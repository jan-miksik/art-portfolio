export default function isMobile() {
  // User agent string method
  let isProbablyMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Screen resolution method
  if (!isProbablyMobile) {
      let screenWidth = window.screen.width;
      let screenHeight = window.screen.height;
      isProbablyMobile = (screenWidth < 768 || screenHeight < 768);
  }

//   // Touch events method
//   if (!isUsingMobile) {
//       isUsingMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.maxTouchPoints > 0));
//   }
  
//   // CSS media queries method
//   if (!isUsingMobile) {
//       let bodyElement = document.getElementsByTagName('body')[0];
//       isUsingMobile = window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf('mobile') !== -1;
//   }

  // const isProbablyMobile = ref(window.innerWidth < 768)
  
  return isProbablyMobile
}
