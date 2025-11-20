import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import TaskItem from "./TaskItem";
import type { DynamicRowHeight } from 'react-window';
import type { ITask } from "@/types";

interface ITaskRowDataProps {
  tasks: ITask[];
  dynamicRowHeight: DynamicRowHeight | null;
}

interface ITaskRowProps extends ITaskRowDataProps {
  index: number;
  style: React.CSSProperties;
}

const TaskRow = observer(({ index, style, tasks, dynamicRowHeight }: ITaskRowProps) => {
  const todo = tasks[index];
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rowRef.current;

    if (!element || !dynamicRowHeight) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
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
