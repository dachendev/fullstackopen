import { Button } from '@material-tailwind/react'
import { useState, forwardRef, useImperativeHandle } from 'react'

const Toggleable = forwardRef(({ text, buttonLabel, buttonLabelCollapse = buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div>
        {text} <Button onClick={toggleVisibility}>{visible ? buttonLabelCollapse : buttonLabel}</Button>
      </div>
      <div style={visible ? {} : { display: 'none' }}>{children}</div>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'

export default Toggleable
