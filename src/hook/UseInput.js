import { useState, useCallback } from "react";

const UseInput = (initialValue) => {
  //initialValue = onChange={setState}가 파라미터로 들어옴
  const [value, setValue] = useState(initialValue);
  //그대로 공용으로 사용 할 state (value)에 저장

  //핸들러 실행
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler];
  //결과를 리턴해줌
};

export default UseInput;
