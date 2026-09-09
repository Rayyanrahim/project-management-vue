import { computed, reactive, ref } from 'vue'

export function useZodForm(schema, initialValues) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const submitted = ref(false)
  const validatedData = ref(null)

  const isValid = computed(() => schema.safeParse(values).success)

  function applyIssues(issues, field) {
    if (!field) {
      Object.keys(errors).forEach((key) => delete errors[key])
    } else {
      delete errors[field]
    }

    for (const issue of issues) {
      const key = issue.path[0]
      if (typeof key !== 'string' || (field && key !== field) || errors[key]) continue
      errors[key] = issue.message
    }
  }

  function validate() {
    submitted.value = true
    const result = schema.safeParse(values)

    if (!result.success) {
      validatedData.value = null
      applyIssues(result.error.issues)
      return false
    }

    applyIssues([])
    validatedData.value = result.data
    return true
  }

  function validateField(field) {
    const result = schema.safeParse(values)
    const issues = result.success
      ? []
      : result.error.issues.filter((issue) => issue.path[0] === field)

    applyIssues(issues, field)
    return issues.length === 0
  }

  function touch(field) {
    touched[field] = true
    validateField(field)
  }

  function revalidate(field) {
    if (submitted.value || touched[field]) validateField(field)
  }

  function setErrors(serverErrors = {}) {
    Object.keys(errors).forEach((key) => delete errors[key])
    let applied = false

    for (const [field, messages] of Object.entries(serverErrors)) {
      if (!(field in values)) continue

      const message = Array.isArray(messages) ? messages[0] : messages
      if (typeof message !== 'string' || !message.trim()) continue

      errors[field] = message
      touched[field] = true
      applied = true
    }

    return applied
  }

  return {
    values,
    errors,
    touched,
    submitted,
    validatedData,
    isValid,
    validate,
    validateField,
    touch,
    revalidate,
    setErrors,
  }
}
