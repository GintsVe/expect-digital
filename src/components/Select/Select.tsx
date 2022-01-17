import React, { FC, useState } from 'react';
import './Select.scss';
import { useDetectClickOutside } from 'react-detect-click-outside';

type SelectProps = {
  list: string[],
  title: string,
  onSelect: (item: string) => void,
}

const Select:FC<SelectProps> = ({ list, title, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [dropdown, setDropdown] = useState<boolean>(false);

  const closeDropdown = () => {
    setDropdown(false);
  };

  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  return (
    <div>
      <fieldset ref={ref} className="select-wrapper">
        <legend className="title">{title}</legend>
        <div
          onClick={() => setDropdown(!dropdown)}
          className="select-header"
        >
          <div className="select-header__title">
            {selectedValue}
          </div>
          <span
            style={dropdown ? { transform: 'rotate(180deg)', top: '18px' } : {}}
            className="select-header__arrow"
          />
        </div>
        {dropdown && (
        <div className="select-list">
          {
            list.map((item) => (
              <div key={item}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedValue(item);
                    setDropdown(false);
                    onSelect(item);
                  }}
                  className="select-list__item"
                  style={selectedValue === item ? { backgroundColor: 'rgba(103, 80, 164, 0.12)' } : {}}
                >
                  {item}
                </button>
              </div>
            ))
          }
        </div>
        )}
      </fieldset>
    </div>

  );
};
export default Select;
