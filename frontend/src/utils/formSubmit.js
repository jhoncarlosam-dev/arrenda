/** Sync native input values into RHF before validate/submit (covers autofill and DOM fills). */
export function withNativeValues(handleSubmit, onValid, setValue) {
  return (event) => {
    const form = event.currentTarget
    if (form) {
      const data = new FormData(form)
      for (const [name, value] of data.entries()) {
        const el = form.elements.namedItem(name)
        if (el && el.type === 'checkbox') {
          setValue(name, el.checked, { shouldValidate: false })
        } else {
          setValue(name, value, { shouldValidate: false })
        }
      }
    }
    return handleSubmit(onValid)(event)
  }
}
