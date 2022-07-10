<template>
<div

class="container"
>
    <div
  ref="modeRef"
  class="mode"
  @click="switchMode"
  />
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const isDarkMode = ref(false)
const amountOfSwitching = ref(0)
const modeRef = ref<HTMLElement>()

onMounted(() => {
  const modeInStorage = localStorage.getItem('darkMode')

  const modeInBrowser = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  if (modeInStorage === 'false') return
  if (modeInStorage === 'true') {
    switchMode()
  } else if (modeInBrowser) {
    switchMode()
  }
})

const switchMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark-mode')
  modeRef.value?.classList.toggle('scaling')
  amountOfSwitching.value++

  // if (amountOfSwitching.value === 5) {
  //   // alert('Seems, that you like switching')
  // }

  if (amountOfSwitching.value % 5 === 0) {
    document.documentElement.style.setProperty('--image-filter-invert', '0')
  }

  if (amountOfSwitching.value % 10 === 0) {
    document.documentElement.style.setProperty('--image-filter-invert', '1')
    // alert('Back to normal')
    // amountOfSwitching.value = 0
  }

  // if (amountOfSwitching.value === 32) {
  //   alert('Seems, that you like switching')
  // }

  // if (amountOfSwitching.value === 78) {
  //   alert('78 switches')
  // }

  localStorage.setItem('darkMode', `${isDarkMode.value ? 'true' : 'false'}`)

  setTimeout(function() {
    modeRef.value?.classList.toggle('scaling')
  }, 520)
}

</script>

<style scoped>

.mode {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0);
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mode::before {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: linear-gradient(to right, white 50%, black 50.01%);
  border: 2px solid rgb(0, 0, 0);
  transition: transform .5s ease-out;
}
.mode::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  mix-blend-mode: difference
}

div {
  position: absolute;

  width: 76px;
  right: 0.12rem;
  top: 2rem;
  font-size: 14px;
  font-weight: 500;
  color: white;
  line-height: 18px;
}

.dark-mode .mode {
  background: rgba(255, 255, 255, 0);
}
.dark-mode .mode::before {
  border: 2px solid black;
  transform: rotate(180deg);
}

@keyframes scaleInner {
  50% { transform: scale(1.8)};
}
.scaling::after {
  animation: scaleInner .5s ease forwards
}
</style>

<!-- This component is based on codepen by Andreas Storm

Copyright (c) 2022 by Andreas Storm (https://codepen.io/avstorm/pen/XWrNNOE)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->
