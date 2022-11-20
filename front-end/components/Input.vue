<template>
  <div class="input">
    <label class="input__label">setup price</label>
    <input class="input__body" 
    :step="step" 
    :required="required" 
    :type="type"
    :value="modelValue"
    @input="handleInputChange"/>
  </div>
</template>

<script setup lang="ts">

interface Props {
  isDisabled?: boolean
  type?: string
  modelValue?: string | number
  step?: string
  required?: boolean
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleInputChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  type: "submit"
})

</script>

<style lang="stylus" scoped>
.input
  display flex
  flex-direction column
  align-items flex-start
  gap 0.1rem
  // outline 10px solid #fff
  // background white
  border-radius 1px 0
  margin 0 0.5rem 1rem

  &__label
    opacity 0.7
    font-size 0.9rem

  &__body
    padding 0.5rem
    border-radius 5px
    caret-color #1464a2
    outline none
    border 2px solid #e8e8e8
    border-style ridge
    box-shadow inset 0 0 11px 0 #f1f1ff

    &:focus
      // animation 7s infinite alternate caret-anim

@keyframes caret-anim
  0%
    caret-color #303030

  100%
    caret-color #bcbcbc

.dark-mode .input__body
  filter invert(1)

</style>