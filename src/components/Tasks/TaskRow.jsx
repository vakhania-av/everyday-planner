import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import TaskItem from "./TaskItem";

const TaskRow = observer(({ index, style, tasks, dynamicRowHeight }) => {
  const todo = tasks[index];
  const rowRef = useRef(null);

  useEffect(() => {
    const element = rowRef.current;

    if (!element || !dynamicRowHeight) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        dynamicRowHeight?.setRowHeight(index, height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [index, dynamicRowHeight]);

  return (
    <div style={style} ref={rowRef}>
      <TaskItem todo={todo} />
    </div>
  );
});

export default TaskRow;
