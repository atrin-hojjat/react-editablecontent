import React, {useState, useRef, useEffect, useMemo} from "react";
import ContentEditable from 'react-contenteditable'
const Section = (props) => {
  const {isActive, value = "", ind, updateValue} = props;
  const container = useRef(null);
  const [showModal, setShowModal] = useState(false)

  const activate = () => {

    var range = document.createRange()
    var sel = window.getSelection()
    
    range.setStart(container.current, 0)
    range.setEnd(container.current, 0)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
  }

  useEffect(() => {
    if(isActive) activate()
  }, [isActive])

  const toggleImportance = () => {
    if (value.startsWith('(')) {
      updateValue(value.replace(/^\(+/g, '').replace(/\)+$/g, ''))
    } else {
      updateValue(`(${value})`)
      
    }
  }

  const pureValue = useMemo(() => value.replace(/^\(+/g, '').replace(/\)+$/g, ''), [value])
  const importanceLevel = useMemo(() => value.split('').filter(item => item === '(').length, [value])
  // console.log(value, pureValue, importanceLevel)
  return (
    <span 
    // contenteditable="true" 
    ref={container} 
    mouse
    // onBlur={e => updateValue(e.target.innerHTML)}
    style={{
      position: 'relative',
      ...(importanceLevel > 0 && {
        border: '1px solid green',
      }),
      padding: '0.25em',
    }}
    onMouseEnter={() => {setShowModal(true)}}
    onMouseLeave={() => {setShowModal(false)}}
    data-importance={importanceLevel}
    key={`${ind}+${pureValue}+${importanceLevel}`}
    >
    {pureValue}
    {showModal && (
      <div contenteditable="false" onClick={toggleImportance} style={{
        position: 'absolute',
        top: '100%',
        background: 'black',
        borderRadius: '0.5em',
        color: 'white', 
        padding: '0.25em'
      }} role="button">
      Importance
      </div>
    )}
    </span>
  );
}

const App = () => {
  const [value, setValue] = React.useState(["I", "am", "edittable"]);
  const [curItem, setCurItem] = useState();

  console.log(value)

  return (
    <ContentEditable style={{
      display: 'flex',
      gap: '0.5em',
    }} 
    // contenteditable="true" 
    onBlur={(e) => {
      const element = e.currentTarget;
      let newList = [];
      element.childNodes.forEach((val, ind) => {
        console.log(ind, val)
        let importance = Number(val.dataset.importance) > 0
        newList = [...newList, ...val.innerText.split(' ').filter(item => !!item).map(item => importance ? `(${item})`: item)]
      })

      setValue(newList)
    }} key="alright">
      {value.map((item, ind) => (
         <Section 
            isActive={ind == curItem} 
            value={item} 
            // key={`${item}-${ind}`} 
            ind={ind} 
            updateValue={(newVal) => {
            //   // alert(newVal)
            //   if (newVal == value[ind]) return;
            //   if (newVal == '') {
            //     setValue(val => {
            //       return [...val.slice(0, ind), ...val.slice(ind + 1)].filter(item => !!item)
            //     })
            //     setCurItem(Math.max(ind - 1, 0))
            //   } else if (newVal.split(' ').every(item => item.length > 0)) {
            //     const [prevWord, newWord] = newVal.split(' ');
            //     setValue(val => [...val.slice(0, ind), prevWord, newWord, ...val.slice(ind + 1)].filter(item => !!item))
            //     setCurItem(ind + 1)                
            //   } else {
                setValue(val => [...val.slice(0, ind), newVal, ...val.slice(ind + 1)].filter(item => !!item))
            //   }
            }}
          />
      ))}
    </ContentEditable>
  );
};
export default App;
