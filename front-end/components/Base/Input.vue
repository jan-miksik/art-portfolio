<template>
  <div class="input">
    <label 
      v-if="label" 
      :for="inputId" 
      class="input__label"
    >
      {{ label }}
    </label>
    <input 
      :id="inputId"
      class="input__body" 
      :step="step" 
      :required="required" 
      :type="type"
      :value="modelValue"
      :disabled="isDisabled"
      :aria-label="label || ariaLabel"
      :aria-required="required"
      :aria-disabled="isDisabled"
      @input="handleInputChange"
    />
  </div>
</template>

<script setup lang="ts">

interface Props {
  isDisabled?: boolean
  type?: string
  modelValue?: string | number
  step?: string
  required?: boolean
  label?: string
  ariaLabel?: string
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleInputChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  type: "text"
})

// Generate unique ID for label-input association
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

</script>

<style lang="stylus" scoped>
.input
  display flex
  flex-direction column
  align-items flex-start
  gap 0.1rem
  border-radius 1px 0
  margin 0 0.5rem 1rem

  &__label
    opacity 0.5
    font-size 0.8rem

  &__body
    padding 0.5rem
    border-radius 5px
    caret-color #1464a2
    text-align center
    width 6rem
    font-size 1rem
    border 1px solid #515151

    &:focus
      animation 7s infinite alternate caret-anim
      outline 2px solid #1464a2
      outline-offset 2px

@keyframes caret-anim
  0%
    caret-color #303030

  100%
    caret-color #bcbcbc

.dark-mode .input__body
  filter invert(1)

</style>