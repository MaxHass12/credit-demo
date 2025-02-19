const TypeSelectedInput = ({ selectedOption, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div>
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
          value=""
          checked={selectedOption === 'OperationCRDT'}
          // onChange={(e) => setSelectedOption(e.target.value)}
        />
        Operation CRDT
      </label>
    </div>
  );
};

export default TypeSelectedInput;
