import * as React from 'react'
import TextField from '@mui/material/TextField'

export default function CustomizedTextField({
  id,
  className,
  type,
  label,
  placeholder,
  helperText,
  fullWidth,
  required,
  autoFocus,
  regex,
  length,
  errorMessage,
  onReturnValue,
}) {
  const [inputValue, setInuptValue] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')

  const isInputError = inputErrorMessage !== ''

  function handleOnChange(e) {
    const value = e.target.value
    const lengthState = +length ? false : true
    const regexState = regex ? false : true

    if ((+length && value.toString().length <= +length) || lengthState) {
      if (isInputError) {
        setInputErrorMessage('')
      }

      if ((regex && (regex.test(value) || value === '')) || regexState) {
        setInuptValue(convertFaToEnNumbers(value))
      } else {
        setInputErrorMessage(errorMessage)
      }
    }
  }

  function handleOnBlur() {
    if (isInputError && inputValue === '') {
      setInputErrorMessage('')
    }
    onReturnValue(inputValue.trim())
  }

  return (
    <TextField
      id={id}
      className={className}
      type={type}
      label={label}
      placeholder={placeholder}
      value={inputValue}
      helperText={inputErrorMessage || helperText}
      error={isInputError}
      fullWidth={fullWidth}
      required={required}
      autoFocus={autoFocus}
      onChange={handleOnChange}
      inputProps={{onBlur: handleOnBlur}}
      sx={{
        ...(type === 'number' && {
          /* Chrome, Safari, Edge, Opera */
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
          /* Firefox */
          'input[type=number]': {
            MozAppearance: 'textfield',
          },
        }),
      }}
    />
  )
}

function convertFaToEnNumbers(persianNumber) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const englishDigits = '0123456789'

  const digitMap = new Map(
    [...persianDigits].map((d, i) => [d, englishDigits[i]]),
  )

  return persianNumber.replace(/[۰-۹]/g, match => digitMap.get(match))
}
