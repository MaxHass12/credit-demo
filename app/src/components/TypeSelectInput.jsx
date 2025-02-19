const TypeSelectedInput = ({ selectedOption, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className="type-select">
      <label>
        <input
          type="radio"
          value="OT"
          checked={selectedOption === 'OT'}
          onChange={handleChange}
        />
        OT
      </label>

      <label>
        <input
          type="radio"
          value="OpCRDT"
          checked={selectedOption === 'OpCRDT'}
          onChange={handleChange}
        />
        Operation CRDT
      </label>

      <label>
        <input
          type="radio"
          value="StateCRDT"
          checked={selectedOption === 'StateCRDT'}
          onChange={handleChange}
        />
        State CRDT
      </label>
    </div>
  );
};

export default TypeSelectedInput;
