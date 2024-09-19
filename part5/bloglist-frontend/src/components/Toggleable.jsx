import { useState, forwardRef, useImperativeHandle } from 'react'

const Toggleable = forwardRef(({ text, buttonLabel, buttonLabelCollapse = buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div>
        {text} <button onClick={toggleVisibility}>{visible ? buttonLabelCollapse : buttonLabel}</button>
      </div>
      <div style={visible ? {} : { display: 'none' }}>
        {children}
      </div>
    </div>
  )
})

export default Toggleable