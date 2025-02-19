function Counter({ value, onIncrease, onDecrease }) {
  return (
    <div>
      <button onClick={onDecrease}>-MINUS</button>
      <input value={value} disabled />
      <button onClick={onIncrease}>+PLUS</button>
    </div>
  );
}

export default Counter;
